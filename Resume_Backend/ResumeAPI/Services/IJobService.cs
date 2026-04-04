using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IJobService
{
    Task<List<JobDto>> SearchJobsAsync(string? query, string? category = null, int count = 10);
    Task<List<CompanyDto>> GetFeaturedCompaniesAsync(string? category = null);
    Task<CompanyDto?> GetCompanyDetailsAsync(string companyName);
}
