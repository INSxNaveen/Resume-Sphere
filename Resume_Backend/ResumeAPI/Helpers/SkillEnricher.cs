namespace ResumeAPI.Helpers;

using ResumeAPI.DTOs;

public static class SkillEnricher
{
    private static readonly Dictionary<string, string> Descriptions = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Python", "A versatile programming language used widely in backend APIs, data science, and AI." },
        { "JavaScript", "The core scripting language of the web, enabling interactive frontend and Node.js applications." },
        { "TypeScript", "A strict syntactical superset of JavaScript that adds static typing to guarantee structural safety." },
        { "C#", "A modern, object-oriented language developed by Microsoft for the highly performant .NET ecosystem." },
        { "Java", "A high-level, class-based, object-oriented language heavily used in large enterprise backends." },
        { "React", "A declarative, efficient component-based UI library for building dynamic single-page web apps." },
        { "Angular", "A comprehensive app-design platform containing a component-based framework for scalable web apps." },
        { "Vue", "An approachable, performant, and versatile framework for building web user interfaces." },
        { "Node.js", "An asynchronous event-driven JavaScript runtime designed to build scalable network applications." },
        { "ASP.NET Core", "A cross-platform, high-performance, open-source framework for modern cloud-based apps." },
        { "SQL", "The standard language for relational database management and data manipulation." },
        { "PostgreSQL", "A powerful, open source object-relational database system with massive enterprise reliability." },
        { "MongoDB", "A highly scalable, document-oriented NoSQL database program." },
        { "Docker", "An OS-level virtualization platform used to deliver software in standardized isolated containers." },
        { "Kubernetes", "An open-source system for automating deployment, scaling, and management of containerized applications." },
        { "Amazon Web Services", "The world's most comprehensive and broadly adopted cloud computing platform." },
        { "Microsoft Azure", "Microsoft's public cloud computing platform providing a broad range of cloud services." },
        { "Git", "A distributed version control system for tracking changes in source code during software development." },
        { "Machine Learning", "A branch of AI focusing on using data and algorithms to imitate the way humans learn." },
        { "Deep Learning", "A subset of ML based on artificial neural networks with multiple layers of processing." },
        { "REST API", "An architectural style for an application program interface that uses HTTP requests to access and use data." },
        { "GraphQL", "A query language for APIs and a runtime for fulfilling those queries with existing data." },
        { "Data Analysis", "The process of systematically applying statistical and logical techniques to describe data." }
    };

    public static MissingSkillDetail Enrich(string skill, string jobTitle)
    {
        var desc = Descriptions.TryGetValue(skill, out var mappedDesc) 
            ? mappedDesc 
            : $"A technical competency commonly required in modern {jobTitle} environments.";

        // Basic dynamic relevance based on the skill
        var relevance = $"Crucial for a {jobTitle} to perform core duties, optimize workflows, and maintain expected standards.";
        
        if (skill.Equals("Docker", StringComparison.OrdinalIgnoreCase) || skill.Equals("Kubernetes", StringComparison.OrdinalIgnoreCase))
            relevance = $"Essential for {jobTitle}s to orchestrate and survive modern microservice deployment lifecycles.";

        if (skill.Equals("Git", StringComparison.OrdinalIgnoreCase))
            relevance = $"Mandatory for {jobTitle}s to handle version control, CI/CD integrations, and team collaboration.";

        if (skill.Equals("Amazon Web Services", StringComparison.OrdinalIgnoreCase) || skill.Equals("Microsoft Azure", StringComparison.OrdinalIgnoreCase))
            relevance = $"A baseline requirement for {jobTitle}s deploying, monitoring, and scaling modern cloud infrastructures.";

        return new MissingSkillDetail
        {
            SkillName = skill,
            Explanation = desc,
            JobRelevance = relevance
        };
    }
}
