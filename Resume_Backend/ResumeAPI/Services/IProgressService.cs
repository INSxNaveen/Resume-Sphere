using ResumeAPI.DTOs;

namespace ResumeAPI.Services;

public interface IProgressService
{
    Task<UpdateProgressResponseDto> UpdateProgressAsync(Guid userId, UpdateProgressRequestDto request);
}
