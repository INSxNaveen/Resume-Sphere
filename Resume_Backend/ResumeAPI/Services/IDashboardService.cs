using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync(Guid userId);
}
