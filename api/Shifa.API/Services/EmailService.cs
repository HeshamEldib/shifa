using System.Net;
using System.Net.Mail;

namespace Shifa.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = _config["EmailSettings:Email"];
            var password = _config["EmailSettings:Password"];
            var host = _config["EmailSettings:Host"];
            var port = int.Parse(_config["EmailSettings:Port"]!);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(email, password)
            };

            var mailMessage = new MailMessage(from: email!, to: toEmail, subject, body)
            {
                IsBodyHtml = true // لكي ندعم تصميم HTML في الإيميل
            };

            await client.SendMailAsync(mailMessage);
        }
    }
}