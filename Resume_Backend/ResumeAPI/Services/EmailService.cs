using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;
using System.Threading.Tasks;

namespace ResumeAPI.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        var emailConfig = _config.GetSection("EmailConfiguration");
        var senderEmail = emailConfig["SenderEmail"];
        var senderName = emailConfig["SenderName"];
        var senderPassword = emailConfig["SenderPassword"];
        var smtpServer = emailConfig["SmtpServer"];
        var port = int.Parse(emailConfig["Port"] ?? "587");

        // DEVELOPMENT/FALLBACK MODE
        // If the user hasn't put a real password in yet, just print the OTP to the terminal
        // so they can test the feature end-to-end without needing a Gmail account!
        if (senderPassword == "your-app-password-here" || string.IsNullOrWhiteSpace(senderPassword))
        {
            _logger.LogWarning($"\n-------------------------------------------------------------");
            _logger.LogWarning($" DEVELOPMENT OTP CAPTURE");
            _logger.LogWarning($" To: {toEmail}");
            _logger.LogWarning($" Subject: {subject}");
            _logger.LogWarning($" Body: {htmlMessage}");
            _logger.LogWarning($"-------------------------------------------------------------\n");
            return;
        }

        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(senderName, senderEmail));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(senderEmail, senderPassword);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
        
        _logger.LogInformation($"Successfully sent OTP email to {toEmail}");
    }
}
