using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAPI.Data;
using ResumeAPI.DTOs;
using ResumeAPI.Models;
using ResumeAPI.Services;

namespace ResumeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;
    private readonly IEmailService _emailService;

    public AuthController(AppDbContext context, IAuthService authService, IEmailService emailService)
    {
        _context = context;
        _authService = authService;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { error = "User with this email already exists." });
        }

        var user = new User
        {
            FullName     = request.FullName,
            Email        = request.Email,
            PasswordHash = _authService.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _authService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDetails
            {
                Id       = user.Id,
                FullName = user.FullName,
                Email    = user.Email
            }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return BadRequest(new { error = "Invalid email or password." });
        }

        if (!_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return BadRequest(new { error = "Invalid email or password." });
        }

        var token = _authService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDetails
            {
                Id       = user.Id,
                FullName = user.FullName,
                Email    = user.Email
            }
        });
    }

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            // Do not reveal that the user does not exist
            return Ok(new { message = "If this email is registered, an OTP has been sent." });
        }

        // Generate 6-digit OTP
        var otp = new Random().Next(100000, 999999).ToString();
        
        user.OtpHash = _authService.HashPassword(otp); // Reuse bcrypt for OTP hash
        user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);
        
        await _context.SaveChangesAsync();

        var emailBody = $"<h2>Password Reset Request</h2><p>Your OTP is: <strong>{otp}</strong></p><p>It is valid for 10 minutes.</p>";
        
        try 
        {
            await _emailService.SendEmailAsync(user.Email, "Your OTP Code", emailBody);
            return Ok(new { message = "If this email is registered, an OTP has been sent." });
        }
        catch (System.Exception ex)
        {
            // Log the ACTUAL error to the console for the user to see
            Console.WriteLine("EMAL ERROR: " + ex.Message);
            if (ex.InnerException != null) Console.WriteLine("INNER ERROR: " + ex.InnerException.Message);
            
            return BadRequest(new { error = "Failed to send email. Check backend logs for SMTP configuration errors." });
        }
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return BadRequest(new { error = "Invalid OTP or Email." });

        if (user.OtpExpiry == null || user.OtpExpiry < DateTime.UtcNow)
            return BadRequest(new { error = "OTP has expired." });

        if (string.IsNullOrEmpty(user.OtpHash) || !_authService.VerifyPassword(request.Otp, user.OtpHash))
            return BadRequest(new { error = "Invalid OTP." });

        // Update password and mark verified
        user.PasswordHash = _authService.HashPassword(request.NewPassword);
        user.IsEmailVerified = true;
        
        // Clear OTP so it's one-time use
        user.OtpHash = null;
        user.OtpExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully." });
    }
}
