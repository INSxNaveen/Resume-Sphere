using ResumeAPI.DTOs;
using ResumeAPI.Helpers;

namespace ResumeAPI.Services;

public class LearningResourceService : ILearningResourceService
{
    // Curated static resource dictionary: skill -> (youtube links, article links)
    private static readonly Dictionary<string, (List<ResourceLink> YouTube, List<ResourceLink> Articles)> _resources =
        new(StringComparer.OrdinalIgnoreCase)
    {
        ["Python"] = (
            new()
            {
                new() { Title = "Python for Beginners – Full Course",          Url = "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
                new() { Title = "Python Tutorial for Beginners (freeCodeCamp)",Url = "https://www.youtube.com/watch?v=rfscVS0vtbw" },
                new() { Title = "Automate the Boring Stuff with Python",        Url = "https://www.youtube.com/watch?v=1F_OgqRuSdI" }
            },
            new()
            {
                new() { Title = "Python Official Docs",            Url = "https://docs.python.org/3/tutorial/" },
                new() { Title = "Real Python Tutorials",           Url = "https://realpython.com/" },
                new() { Title = "W3Schools Python Tutorial",       Url = "https://www.w3schools.com/python/" }
            }
        ),
        ["Java"] = (
            new()
            {
                new() { Title = "Java Full Course (freeCodeCamp)",             Url = "https://www.youtube.com/watch?v=grEKMHGYyns" },
                new() { Title = "Java Tutorial for Beginners",                 Url = "https://www.youtube.com/watch?v=eIrMbAQSU34" },
                new() { Title = "Java Programming for Beginners – Telusko",   Url = "https://www.youtube.com/watch?v=8cm1x4bC610" }
            },
            new()
            {
                new() { Title = "Oracle Java Documentation",       Url = "https://docs.oracle.com/en/java/" },
                new() { Title = "Baeldung Java Guides",            Url = "https://www.baeldung.com/" },
                new() { Title = "W3Schools Java Tutorial",         Url = "https://www.w3schools.com/java/" }
            }
        ),
        ["C#"] = (
            new()
            {
                new() { Title = "C# Tutorial for Beginners (Mosh)",           Url = "https://www.youtube.com/watch?v=GhQdlIFylQ8" },
                new() { Title = "C# Full Course (freeCodeCamp)",               Url = "https://www.youtube.com/watch?v=GhQdlIFylQ8" },
                new() { Title = "C# for Beginners – Microsoft",               Url = "https://www.youtube.com/watch?v=KT2VR7m19So" }
            },
            new()
            {
                new() { Title = "Microsoft C# Documentation",      Url = "https://learn.microsoft.com/en-us/dotnet/csharp/" },
                new() { Title = "C# Corner",                       Url = "https://www.c-sharpcorner.com/" },
                new() { Title = "W3Schools C# Tutorial",           Url = "https://www.w3schools.com/cs/" }
            }
        ),
        ["JavaScript"] = (
            new()
            {
                new() { Title = "JavaScript Crash Course (Traversy Media)",    Url = "https://www.youtube.com/watch?v=hdI2bqOjy3c" },
                new() { Title = "JS Tutorial for Beginners (freeCodeCamp)",    Url = "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
                new() { Title = "JavaScript Full Course",                      Url = "https://www.youtube.com/watch?v=jS4aFq5-91M" }
            },
            new()
            {
                new() { Title = "MDN JavaScript Guide",            Url = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
                new() { Title = "JavaScript.info",                 Url = "https://javascript.info/" },
                new() { Title = "W3Schools JS Tutorial",           Url = "https://www.w3schools.com/js/" }
            }
        ),
        ["TypeScript"] = (
            new()
            {
                new() { Title = "TypeScript Course for Beginners",             Url = "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
                new() { Title = "TypeScript Full Tutorial",                    Url = "https://www.youtube.com/watch?v=30LWjhZzg50" },
                new() { Title = "TypeScript Crash Course",                     Url = "https://www.youtube.com/watch?v=BCg4U1FzODs" }
            },
            new()
            {
                new() { Title = "TypeScript Official Handbook",    Url = "https://www.typescriptlang.org/docs/handbook/intro.html" },
                new() { Title = "TypeScript Deep Dive (Book)",     Url = "https://basarat.gitbook.io/typescript/" },
                new() { Title = "W3Schools TypeScript Tutorial",   Url = "https://www.w3schools.com/typescript/" }
            }
        ),
        ["SQL"] = (
            new()
            {
                new() { Title = "SQL Tutorial for Beginners",                  Url = "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
                new() { Title = "SQL Full Course (freeCodeCamp)",              Url = "https://www.youtube.com/watch?v=qw--VYLpxG4" },
                new() { Title = "MySQL Tutorial for Beginners",                Url = "https://www.youtube.com/watch?v=7S_tz1z_5bA" }
            },
            new()
            {
                new() { Title = "W3Schools SQL Tutorial",          Url = "https://www.w3schools.com/sql/" },
                new() { Title = "SQLZoo Interactive Tutorial",     Url = "https://sqlzoo.net/" },
                new() { Title = "Mode SQL Tutorial",               Url = "https://mode.com/sql-tutorial/" }
            }
        ),
        ["PostgreSQL"] = (
            new()
            {
                new() { Title = "PostgreSQL Tutorial for Beginners",           Url = "https://www.youtube.com/watch?v=qw--VYLpxG4" },
                new() { Title = "Learn PostgreSQL (freeCodeCamp)",             Url = "https://www.youtube.com/watch?v=qw--VYLpxG4" },
                new() { Title = "PostgreSQL Crash Course",                     Url = "https://www.youtube.com/watch?v=Dd2ej-QKrWY" }
            },
            new()
            {
                new() { Title = "PostgreSQL Official Docs",        Url = "https://www.postgresql.org/docs/" },
                new() { Title = "PostgreSQL Tutorial",             Url = "https://www.postgresqltutorial.com/" },
                new() { Title = "Prisma PostgreSQL Guide",         Url = "https://www.prisma.io/dataguide/postgresql" }
            }
        ),
        ["MySQL"] = (
            new()
            {
                new() { Title = "MySQL Tutorial for Beginners (Mosh)",         Url = "https://www.youtube.com/watch?v=7S_tz1z_5bA" },
                new() { Title = "MySQL Full Course",                           Url = "https://www.youtube.com/watch?v=En6ANFNsXzQ" },
                new() { Title = "SQL & MySQL Crash Course",                    Url = "https://www.youtube.com/watch?v=ER8oKX5myE0" }
            },
            new()
            {
                new() { Title = "MySQL Documentation",             Url = "https://dev.mysql.com/doc/" },
                new() { Title = "W3Schools MySQL Tutorial",        Url = "https://www.w3schools.com/mysql/" },
                new() { Title = "TutorialsPoint MySQL",            Url = "https://www.tutorialspoint.com/mysql/index.htm" }
            }
        ),
        ["MongoDB"] = (
            new()
            {
                new() { Title = "MongoDB Crash Course (Traversy)",             Url = "https://www.youtube.com/watch?v=-56x56UppqQ" },
                new() { Title = "MongoDB Full Tutorial",                       Url = "https://www.youtube.com/watch?v=ExcRbA7fy22" },
                new() { Title = "MongoDB Basics (MongoDB University)",         Url = "https://www.youtube.com/watch?v=RGfFpQF0NpE" }
            },
            new()
            {
                new() { Title = "MongoDB Official Docs",           Url = "https://www.mongodb.com/docs/" },
                new() { Title = "MongoDB University Free Courses", Url = "https://learn.mongodb.com/" },
                new() { Title = "W3Schools MongoDB Tutorial",      Url = "https://www.w3schools.com/mongodb/" }
            }
        ),
        ["React"] = (
            new()
            {
                new() { Title = "React JS Crash Course (Traversy Media)",      Url = "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
                new() { Title = "React Tutorial for Beginners (freeCodeCamp)", Url = "https://www.youtube.com/watch?v=bMknfKXIFA8" },
                new() { Title = "React Full Course 2024",                      Url = "https://www.youtube.com/watch?v=CgkZ7MvWUAA" }
            },
            new()
            {
                new() { Title = "React Official Docs",             Url = "https://react.dev/learn" },
                new() { Title = "React Tutorial – W3Schools",      Url = "https://www.w3schools.com/react/" },
                new() { Title = "Scrimba React Course",            Url = "https://scrimba.com/learn/learnreact" }
            }
        ),
        ["Angular"] = (
            new()
            {
                new() { Title = "Angular Crash Course (Traversy Media)",       Url = "https://www.youtube.com/watch?v=3qBXWUpoPHo" },
                new() { Title = "Angular Tutorial for Beginners",              Url = "https://www.youtube.com/watch?v=htPYk6QxacQ" },
                new() { Title = "Angular Full Course (freeCodeCamp)",          Url = "https://www.youtube.com/watch?v=k5E2AVpwsko" }
            },
            new()
            {
                new() { Title = "Angular Official Docs",           Url = "https://angular.io/docs" },
                new() { Title = "Angular Tutorial – W3Schools",    Url = "https://www.w3schools.com/angular/" },
                new() { Title = "Angular University Blog",         Url = "https://blog.angular-university.io/" }
            }
        ),
        ["Vue"] = (
            new()
            {
                new() { Title = "Vue JS Crash Course (Traversy Media)",        Url = "https://www.youtube.com/watch?v=qZXt1Aom3Cs" },
                new() { Title = "Vue 3 Full Tutorial",                         Url = "https://www.youtube.com/watch?v=VeNfHj6MhgA" },
                new() { Title = "Vue Tutorial for Beginners",                  Url = "https://www.youtube.com/watch?v=FXpIoQ_rT_c" }
            },
            new()
            {
                new() { Title = "Vue Official Docs",               Url = "https://vuejs.org/guide/introduction" },
                new() { Title = "Vue School Free Courses",         Url = "https://vueschool.io/" },
                new() { Title = "W3Schools Vue Tutorial",          Url = "https://www.w3schools.com/vue/" }
            }
        ),
        ["Node.js"] = (
            new()
            {
                new() { Title = "Node.js Crash Course (Traversy Media)",       Url = "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
                new() { Title = "Node.js Tutorial for Beginners",              Url = "https://www.youtube.com/watch?v=TlB_eWDSMt4" },
                new() { Title = "Node.js Full Course (freeCodeCamp)",          Url = "https://www.youtube.com/watch?v=Oe421EPjeBE" }
            },
            new()
            {
                new() { Title = "Node.js Official Docs",           Url = "https://nodejs.org/en/docs" },
                new() { Title = "Node.js Guide – MDN",             Url = "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs" },
                new() { Title = "W3Schools Node.js Tutorial",      Url = "https://www.w3schools.com/nodejs/" }
            }
        ),
        [".NET"] = (
            new()
            {
                new() { Title = ".NET Core Tutorial for Beginners",            Url = "https://www.youtube.com/watch?v=4olO9UjRiww" },
                new() { Title = ".NET 8 Full Course",                          Url = "https://www.youtube.com/watch?v=AhAxLiGC7Pc" },
                new() { Title = ".NET Microservices – Full Course",            Url = "https://www.youtube.com/watch?v=DgVjEo3OGBI" }
            },
            new()
            {
                new() { Title = "Microsoft .NET Docs",             Url = "https://learn.microsoft.com/en-us/dotnet/" },
                new() { Title = ".NET Blog",                       Url = "https://devblogs.microsoft.com/dotnet/" },
                new() { Title = "TutorialsPoint .NET",             Url = "https://www.tutorialspoint.com/dotnet/index.htm" }
            }
        ),
        ["ASP.NET Core"] = (
            new()
            {
                new() { Title = "ASP.NET Core Tutorial for Beginners",         Url = "https://www.youtube.com/watch?v=hZ1DASYd9rk" },
                new() { Title = "ASP.NET Core Web API Full Course",            Url = "https://www.youtube.com/watch?v=7niV0LATaNU" },
                new() { Title = "ASP.NET Core MVC Full Course",                Url = "https://www.youtube.com/watch?v=C5cnZ-gZy2I" }
            },
            new()
            {
                new() { Title = "Microsoft ASP.NET Core Docs",     Url = "https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-8.0" },
                new() { Title = "Pluralsight ASP.NET Guides",      Url = "https://www.pluralsight.com/paths/aspnet-core" },
                new() { Title = "Code Maze ASP.NET Core",          Url = "https://code-maze.com/asp-net-core-series/" }
            }
        ),
        ["Machine Learning"] = (
            new()
            {
                new() { Title = "Machine Learning Course – Andrew Ng",         Url = "https://www.youtube.com/watch?v=PPLop4L2eGk" },
                new() { Title = "ML for Beginners (freeCodeCamp)",             Url = "https://www.youtube.com/watch?v=i_LwzRVP7bg" },
                new() { Title = "Machine Learning Full Course 2024",           Url = "https://www.youtube.com/watch?v=2kSl0xkqEJU&list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe" }
            },
            new()
            {
                new() { Title = "Google Machine Learning Crash Course", Url = "https://developers.google.com/machine-learning/crash-course" },
                new() { Title = "Scikit-learn Documentation",          Url = "https://scikit-learn.org/stable/user_guide.html" },
                new() { Title = "Fast.ai Practical ML Course",         Url = "https://www.fast.ai/" }
            }
        ),
        ["Deep Learning"] = (
            new()
            {
                new() { Title = "Deep Learning Specialization (Overview)",     Url = "https://www.youtube.com/watch?v=CS4cs9xVecg" },
                new() { Title = "Neural Networks from Scratch",                Url = "https://www.youtube.com/watch?v=Wo5dMEP_BbI" },
                new() { Title = "Deep Learning Full Course (freeCodeCamp)",    Url = "https://www.youtube.com/watch?v=VyWAvY2CF9c" }
            },
            new()
            {
                new() { Title = "Deep Learning Book (Goodfellow)",  Url = "https://www.deeplearningbook.org/" },
                new() { Title = "fast.ai Deep Learning Course",     Url = "https://course.fast.ai/" },
                new() { Title = "TensorFlow Tutorials",             Url = "https://www.tensorflow.org/tutorials" }
            }
        ),
        ["TensorFlow"] = (
            new()
            {
                new() { Title = "TensorFlow 2.0 Full Tutorial",                Url = "https://www.youtube.com/watch?v=tPYj3fFJGjk" },
                new() { Title = "TensorFlow Crash Course",                     Url = "https://www.youtube.com/watch?v=6g4O5UOH304" },
                new() { Title = "Deep Learning with TensorFlow",               Url = "https://www.youtube.com/watch?v=MotG3XI2qSs" }
            },
            new()
            {
                new() { Title = "TensorFlow Official Tutorials",   Url = "https://www.tensorflow.org/tutorials" },
                new() { Title = "TensorFlow Guide",                Url = "https://www.tensorflow.org/guide" },
                new() { Title = "Keras Documentation",             Url = "https://keras.io/guides/" }
            }
        ),
        ["PyTorch"] = (
            new()
            {
                new() { Title = "PyTorch Full Course for Beginners",           Url = "https://www.youtube.com/watch?v=c36lUUr864M" },
                new() { Title = "PyTorch Tutorial (freeCodeCamp)",             Url = "https://www.youtube.com/watch?v=GIsg-ZUy0MY" },
                new() { Title = "Deep Learning with PyTorch",                  Url = "https://www.youtube.com/watch?v=ORMx45xqWkA" }
            },
            new()
            {
                new() { Title = "PyTorch Official Tutorials",      Url = "https://pytorch.org/tutorials/" },
                new() { Title = "PyTorch Documentation",           Url = "https://pytorch.org/docs/stable/index.html" },
                new() { Title = "fast.ai PyTorch Course",          Url = "https://course.fast.ai/" }
            }
        ),
        ["Docker"] = (
            new()
            {
                new() { Title = "Docker Tutorial for Beginners",               Url = "https://www.youtube.com/watch?v=pTFZFxd5hOI" },
                new() { Title = "Docker Crash Course (TechWorld with Nana)",   Url = "https://www.youtube.com/watch?v=3c-iBn73dDE" },
                new() { Title = "Docker Full Course",                          Url = "https://www.youtube.com/watch?v=fqMOX6JJhGo" }
            },
            new()
            {
                new() { Title = "Docker Official Docs",            Url = "https://docs.docker.com/" },
                new() { Title = "Docker Getting Started Tutorial", Url = "https://docs.docker.com/get-started/" },
                new() { Title = "Play With Docker",                Url = "https://labs.play-with-docker.com/" }
            }
        ),
        ["Kubernetes"] = (
            new()
            {
                new() { Title = "Kubernetes Tutorial for Beginners",           Url = "https://www.youtube.com/watch?v=X48VuDVv0do" },
                new() { Title = "Kubernetes Crash Course (TechWorld)",         Url = "https://www.youtube.com/watch?v=s_o8dwzRlu4" },
                new() { Title = "Kubernetes Full Course",                      Url = "https://www.youtube.com/watch?v=d6WC5n9G_sM" }
            },
            new()
            {
                new() { Title = "Kubernetes Official Docs",        Url = "https://kubernetes.io/docs/home/" },
                new() { Title = "Kubernetes Tutorials",            Url = "https://kubernetes.io/docs/tutorials/" },
                new() { Title = "KodeCloud Kubernetes Labs",       Url = "https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/" }
            }
        ),
        ["Git"] = (
            new()
            {
                new() { Title = "Git Tutorial for Beginners",                  Url = "https://www.youtube.com/watch?v=8JJ101D3knE" },
                new() { Title = "Git & GitHub Crash Course (Traversy Media)",  Url = "https://www.youtube.com/watch?v=SWYqp7iY_Tc" },
                new() { Title = "Git Full Course (freeCodeCamp)",              Url = "https://www.youtube.com/watch?v=RGOj5yH7evk" }
            },
            new()
            {
                new() { Title = "Pro Git Book (Free)",             Url = "https://git-scm.com/book/en/v2" },
                new() { Title = "GitHub Docs – Git Basics",        Url = "https://docs.github.com/en/get-started/using-git/about-git" },
                new() { Title = "Atlassian Git Tutorials",         Url = "https://www.atlassian.com/git/tutorials" }
            }
        ),
        ["REST API"] = (
            new()
            {
                new() { Title = "REST API Concepts and Examples",              Url = "https://www.youtube.com/watch?v=7YcW25PHnAA" },
                new() { Title = "RESTful APIs in 100 Seconds",                 Url = "https://www.youtube.com/watch?v=-MTSQjw5DrM" },
                new() { Title = "REST API Full Course",                        Url = "https://www.youtube.com/watch?v=0oXYLzuucwE" }
            },
            new()
            {
                new() { Title = "REST API Design Guide",           Url = "https://restfulapi.net/" },
                new() { Title = "MDN HTTP Guide",                  Url = "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
                new() { Title = "Swagger REST API Guide",          Url = "https://swagger.io/resources/articles/best-practices-in-api-design/" }
            }
        ),
        ["GraphQL"] = (
            new()
            {
                new() { Title = "GraphQL Full Course (freeCodeCamp)",          Url = "https://www.youtube.com/watch?v=ed8SzALpx1Q" },
                new() { Title = "GraphQL Tutorial for Beginners",              Url = "https://www.youtube.com/watch?v=ZQL7tL2S0oQ" },
                new() { Title = "GraphQL Crash Course",                        Url = "https://www.youtube.com/watch?v=BcLNfwF04Kw" }
            },
            new()
            {
                new() { Title = "GraphQL Official Docs",           Url = "https://graphql.org/learn/" },
                new() { Title = "How to GraphQL",                  Url = "https://www.howtographql.com/" },
                new() { Title = "Apollo GraphQL Docs",             Url = "https://www.apollographql.com/docs/" }
            }
        ),
        ["AWS"] = (
            new()
            {
                new() { Title = "AWS Tutorial for Beginners (freeCodeCamp)",   Url = "https://www.youtube.com/watch?v=3hLmDS179YE" },
                new() { Title = "AWS Crash Course",                            Url = "https://www.youtube.com/watch?v=ulprqHHWlng" },
                new() { Title = "AWS Full Course 2024",                        Url = "https://www.youtube.com/watch?v=ZB5ONbD_SMY" }
            },
            new()
            {
                new() { Title = "AWS Documentation",               Url = "https://docs.aws.amazon.com/" },
                new() { Title = "AWS Training & Certification",    Url = "https://aws.amazon.com/training/" },
                new() { Title = "Cloud Guru AWS Free Tier",        Url = "https://acloudguru.com/learning-paths/aws" }
            }
        ),
        ["Azure"] = (
            new()
            {
                new() { Title = "Azure Full Course (freeCodeCamp)",            Url = "https://www.youtube.com/watch?v=NKEFWyqJ5XA" },
                new() { Title = "Azure Tutorial for Beginners",                Url = "https://www.youtube.com/watch?v=tDuruX7XSac" },
                new() { Title = "Microsoft Azure Fundamentals (AZ-900)",       Url = "https://www.youtube.com/watch?v=pY0LnKiDwRA" }
            },
            new()
            {
                new() { Title = "Microsoft Azure Docs",            Url = "https://learn.microsoft.com/en-us/azure/" },
                new() { Title = "Microsoft Learn – Azure",         Url = "https://learn.microsoft.com/en-us/training/azure/" },
                new() { Title = "Azure Architecture Center",       Url = "https://learn.microsoft.com/en-us/azure/architecture/" }
            }
        ),
        ["Linux"] = (
            new()
            {
                new() { Title = "Linux Command Line Full Course",               Url = "https://www.youtube.com/watch?v=ZtqBQ68cfJc" },
                new() { Title = "Linux Tutorial for Beginners",                Url = "https://www.youtube.com/watch?v=sWbUDq4S6Y8" },
                new() { Title = "Linux for Hackers (NetworkChuck)",            Url = "https://www.youtube.com/watch?v=VbEx7B_PTOE" }
            },
            new()
            {
                new() { Title = "Linux Journey (Interactive)",     Url = "https://linuxjourney.com/" },
                new() { Title = "The Linux Command Line Book",     Url = "https://linuxcommand.org/tlcl.php" },
                new() { Title = "Linux Foundation Training",       Url = "https://training.linuxfoundation.org/" }
            }
        ),
        ["Data Analysis"] = (
            new()
            {
                new() { Title = "Data Analysis with Python (freeCodeCamp)",    Url = "https://www.youtube.com/watch?v=r-uOLxNrNk8" },
                new() { Title = "Data Analysis Crash Course",                  Url = "https://www.youtube.com/watch?v=GPVsHOlRBBI" },
                new() { Title = "Pandas & Data Analysis Full Course",          Url = "https://www.youtube.com/watch?v=vmEHCJofslg" }
            },
            new()
            {
                new() { Title = "Kaggle Data Analysis Courses",   Url = "https://www.kaggle.com/learn/pandas" },
                new() { Title = "Towards Data Science Blog",      Url = "https://towardsdatascience.com/" },
                new() { Title = "Analytics Vidhya Blog",          Url = "https://www.analyticsvidhya.com/blog/" }
            }
        ),
        ["Pandas"] = (
            new()
            {
                new() { Title = "Pandas Library Tutorial",                     Url = "https://www.youtube.com/watch?v=vmEHCJofslg" },
                new() { Title = "Pandas Crash Course",                         Url = "https://www.youtube.com/watch?v=2uvysYbKdjM" },
                new() { Title = "Pandas Full Course (freeCodeCamp)",           Url = "https://www.youtube.com/watch?v=r-uOLxNrNk8" }
            },
            new()
            {
                new() { Title = "Pandas Official Documentation",   Url = "https://pandas.pydata.org/docs/" },
                new() { Title = "Kaggle Pandas Tutorial",          Url = "https://www.kaggle.com/learn/pandas" },
                new() { Title = "Real Python Pandas Guide",        Url = "https://realpython.com/pandas-python-explore-dataset/" }
            }
        ),
        ["Scikit-learn"] = (
            new()
            {
                new() { Title = "Scikit-learn Tutorial for Beginners",         Url = "https://www.youtube.com/watch?v=0Lt9w-BxKFQ" },
                new() { Title = "Machine Learning with Scikit-learn",          Url = "https://www.youtube.com/watch?v=M9Itm95nc9I" },
                new() { Title = "Sklearn Full Course",                         Url = "https://www.youtube.com/watch?v=pqNCD_5r0IU" }
            },
            new()
            {
                new() { Title = "Scikit-learn Official Docs",      Url = "https://scikit-learn.org/stable/" },
                new() { Title = "Kaggle ML Course",                Url = "https://www.kaggle.com/learn/intro-to-machine-learning" },
                new() { Title = "Real Python Scikit-learn Guide",  Url = "https://realpython.com/python-sklearn/" }
            }
        )
    };

    public Task<ResourceResult> GetResourcesAsync(string skill)
    {
        var result = new ResourceResult 
        { 
            Skill = skill,
            Summary = SkillEnricher.Enrich(skill, "Software Professional").Explanation
        };

        if (_resources.TryGetValue(skill, out var resources))
        {
            result.YouTubeLinks  = resources.YouTube;
            result.ArticleLinks  = resources.Articles;
        }
        else
        {
            // Generic fallback for unknown skills
            var encoded = Uri.EscapeDataString(skill);
            result.YouTubeLinks = new List<ResourceLink>
            {
                new() { Title = $"{skill} Tutorial on YouTube", Url = $"https://www.youtube.com/results?search_query={encoded}+tutorial" }
            };
            result.ArticleLinks = new List<ResourceLink>
            {
                new() { Title = $"Search {skill} on Google",     Url = $"https://www.google.com/search?q={encoded}+tutorial" },
                new() { Title = $"{skill} on MDN / Docs",        Url = $"https://developer.mozilla.org/en-US/search?q={encoded}" }
            };
        }

        return Task.FromResult(result);
    }
}
