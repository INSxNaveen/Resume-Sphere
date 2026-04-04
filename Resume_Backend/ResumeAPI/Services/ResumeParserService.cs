using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using System.Text;

namespace ResumeAPI.Services;

public class ResumeParserService : IResumeParserService
{
    public async Task<string> ExtractTextAsync(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);
        stream.Position = 0;

        return extension switch
        {
            ".pdf"  => ExtractFromPdf(stream),
            ".docx" => ExtractFromDocx(stream),
            _       => throw new NotSupportedException($"File type '{extension}' is not supported. Please upload a PDF or DOCX file.")
        };
    }

    private static string ExtractFromPdf(Stream stream)
    {
        var sb = new StringBuilder();
        using var pdf = PdfDocument.Open(stream);
        foreach (var page in pdf.GetPages())
        {
            sb.AppendLine(page.Text);
        }
        return sb.ToString();
    }

    private static string ExtractFromDocx(Stream stream)
    {
        var sb = new StringBuilder();
        using var doc = WordprocessingDocument.Open(stream, false);
        var body = doc.MainDocumentPart?.Document?.Body;
        if (body is null) return string.Empty;

        foreach (var text in body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Text>())
        {
            sb.Append(text.Text).Append(' ');
        }
        return sb.ToString();
    }
}
