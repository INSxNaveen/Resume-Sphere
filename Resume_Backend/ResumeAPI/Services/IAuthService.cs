using ResumeAPI.Models;

namespace ResumeAPI.Services;

public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
    string CreateToken(User user);
}
