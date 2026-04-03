namespace ResumeAPI.DTOs;

public class ResourceResult
{
    public string Skill { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<ResourceLink> YouTubeLinks { get; set; } = new();
    public List<ResourceLink> ArticleLinks { get; set; } = new();
}

public class ResourceLink
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
