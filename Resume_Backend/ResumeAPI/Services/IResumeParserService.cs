namespace ResumeAPI.Services;

public interface IResumeParserService
{
    Task<string> ExtractTextAsync(IFormFile file);
}
