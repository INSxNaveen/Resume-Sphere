using System.Threading.Tasks;

namespace ResumeAPI.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
}
