using System.Text.RegularExpressions;

namespace ResumeAPI.Services;

public class SkillExtractorService : ISkillExtractorService
{
    // A mapping of variations/aliases to their Canonical Skill Name
    private static readonly Dictionary<string, string> SkillTaxonomy = new(StringComparer.OrdinalIgnoreCase)
    {
        // Aliases -> Canonical Form
        { "JS", "JavaScript" },
        { "TS", "TypeScript" },
        { "Node", "Node.js" },
        { "NodeJS", "Node.js" },
        { "ReactJS", "React" },
        { "React.js", "React" },
        { "VueJS", "Vue" },
        { "Vue.js", "Vue" },
        { "AngularJS", "Angular" },
        { "Golang", "Go" },
        { "C++", "C++" },
        { "C#", "C#" },
        { ".NET Core", "ASP.NET Core" },
        { ".NET", ".NET" },
        { "ML", "Machine Learning" },
        { "DL", "Deep Learning" },
        { "K8s", "Kubernetes" },
        { "AWS", "Amazon Web Services" },
        { "GCP", "Google Cloud Platform" },
        { "Azure", "Microsoft Azure" },
        { "Postgres", "PostgreSQL" },
        { "Mongo", "MongoDB" },
        { "RN", "React Native" },
        { "NLP", "Natural Language Processing" },
        { "LLM", "Large Language Models" },
        { "Keras", "Keras" },
        { "PyTorch", "PyTorch" },
        { "TF", "TensorFlow" },
        { "TensorFlow", "TensorFlow" },
        { "SQL Server", "Microsoft SQL Server" },
        { "MSSQL", "Microsoft SQL Server" }
    };

    // The canonical 100+ list of primary skills (if we encounter these exactly, keep them)
    private static readonly HashSet<string> CoreSkills = new(StringComparer.OrdinalIgnoreCase)
    {
        "Python", "Java", "C#", "C++", "JavaScript", "TypeScript", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby",
        "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB", "Oracle",
        "React", "Angular", "Vue", "Svelte", "Next.js", "Nuxt.js", "HTML", "CSS", "Tailwind CSS", "Sass",
        "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET Core", "Ruby on Rails", "Laravel",
        "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "Scikit-learn", "PyTorch", "TensorFlow", "Keras", "Computer Vision",
        "Docker", "Kubernetes", "Amazon Web Services", "Microsoft Azure", "Google Cloud Platform", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "CI/CD",
        "Git", "REST API", "GraphQL", "gRPC", "WebSockets", "Microservices", "System Design", "Agile", "Scrum",
        "Data Structures", "Algorithms", "Object-Oriented Programming", "Functional Programming", "Test-Driven Development",
        "Linux", "Ubuntu", "Bash", "Shell Scripting", "Nginx", "Apache",
        "Figma", "UI/UX Design", "Wireframing", "Prototyping",
        "Cybersecurity", "Penetration Testing", "Cryptography", "OAuth", "JWT",
        "Unity", "Unreal Engine", "Game Development",
        "Blockchain", "Smart Contracts", "Solidity", "Web3"
    };

    // Pre-compiled regex patterns for speed.
    // Key = search term (alias or core), Value = compiled regex
    private static readonly Dictionary<string, Regex> _compiledPatterns = new(StringComparer.OrdinalIgnoreCase);

    static SkillExtractorService()
    {
        // Populate compiled patterns to avoid regex compilation on every request
        foreach (var alias in SkillTaxonomy.Keys)
        {
            _compiledPatterns[alias] = CreatePattern(alias);
        }
        foreach (var skill in CoreSkills)
        {
            _compiledPatterns[skill] = CreatePattern(skill);
        }
    }

    private static Regex CreatePattern(string term)
    {
        // Word boundary aware regex that supports symbols like C++, .NET, React.js
        return new Regex(@"(?<![a-zA-Z0-9])" + Regex.Escape(term) + @"(?![a-zA-Z0-9])", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    }

    public Task<List<string>> ExtractSkillsAsync(string resumeText)
    {
        if (string.IsNullOrWhiteSpace(resumeText)) 
            return Task.FromResult(new List<string>());

        // Use a HashSet to avoid duplicates automatically
        var detected = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var kvp in _compiledPatterns)
        {
            var searchTerm = kvp.Key;
            var regex = kvp.Value;

            if (regex.IsMatch(resumeText))
            {
                // If it's an alias (like JS), map it to canonical (JavaScript)
                // If it's a core skill, use it directly
                var canonical = SkillTaxonomy.ContainsKey(searchTerm) 
                    ? SkillTaxonomy[searchTerm] 
                    : CoreSkills.First(s => string.Equals(s, searchTerm, StringComparison.OrdinalIgnoreCase));
                
                detected.Add(canonical);
            }
        }

        return Task.FromResult(detected.OrderBy(s => s).ToList());
    }
}
