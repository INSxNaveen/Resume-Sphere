"""
Master skill dictionary with canonical names and synonyms.
This is the single source of truth for skill normalization across the entire system.
"""

# Maps alias → canonical name (case-insensitive matching applied at lookup time)
SYNONYM_MAP: dict[str, str] = {
    # JavaScript ecosystem
    "js": "JavaScript",
    "javascript": "JavaScript",
    "es6": "JavaScript",
    "ecmascript": "JavaScript",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "reactjs": "React",
    "react.js": "React",
    "react js": "React",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "vue js": "Vue",
    "angularjs": "Angular",
    "angular.js": "Angular",
    "angular js": "Angular",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nuxtjs": "Nuxt.js",
    "nuxt.js": "Nuxt.js",
    "sveltejs": "Svelte",
    "expressjs": "Express",
    "express.js": "Express",

    # Python ecosystem
    "python3": "Python",
    "python 3": "Python",
    "py": "Python",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scipy": "SciPy",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "matplotlib": "Matplotlib",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "keras": "Keras",

    # Java / JVM
    "java": "Java",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "kotlin": "Kotlin",
    "scala": "Scala",

    # .NET
    "c#": "C#",
    "csharp": "C#",
    "c sharp": "C#",
    ".net": ".NET",
    "dotnet": ".NET",
    ".net core": "ASP.NET Core",
    "asp.net": "ASP.NET Core",
    "asp.net core": "ASP.NET Core",
    "entity framework": "Entity Framework",
    "ef core": "Entity Framework",
    "entity framework core": "Entity Framework",

    # C / C++
    "c++": "C++",
    "cpp": "C++",
    "c": "C",

    # Go / Rust
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "rustlang": "Rust",

    # Databases
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "pg": "PostgreSQL",
    "mysql": "MySQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "elasticsearch": "Elasticsearch",
    "elastic search": "Elasticsearch",
    "es": "Elasticsearch",
    "cassandra": "Cassandra",
    "dynamodb": "DynamoDB",
    "dynamo db": "DynamoDB",
    "oracle": "Oracle",
    "sql server": "Microsoft SQL Server",
    "mssql": "Microsoft SQL Server",
    "ms sql": "Microsoft SQL Server",
    "sqlite": "SQLite",
    "mariadb": "MariaDB",
    "neo4j": "Neo4j",
    "cockroachdb": "CockroachDB",
    "firebase": "Firebase",
    "firestore": "Firestore",
    "supabase": "Supabase",

    # Cloud & DevOps
    "aws": "Amazon Web Services",
    "amazon web services": "Amazon Web Services",
    "gcp": "Google Cloud Platform",
    "google cloud": "Google Cloud Platform",
    "google cloud platform": "Google Cloud Platform",
    "azure": "Microsoft Azure",
    "microsoft azure": "Microsoft Azure",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "terraform": "Terraform",
    "ansible": "Ansible",
    "jenkins": "Jenkins",
    "github actions": "GitHub Actions",
    "gitlab ci": "GitLab CI",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "nginx": "Nginx",
    "apache": "Apache",
    "heroku": "Heroku",
    "vercel": "Vercel",
    "netlify": "Netlify",
    "cloudflare": "Cloudflare",
    "digitalocean": "DigitalOcean",

    # Data Science / ML / AI
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "computer vision": "Computer Vision",
    "cv": "Computer Vision",
    "llm": "Large Language Models",
    "large language models": "Large Language Models",
    "data analysis": "Data Analysis",
    "data science": "Data Science",
    "data engineering": "Data Engineering",
    "data visualization": "Data Visualization",
    "power bi": "Power BI",
    "tableau": "Tableau",
    "hadoop": "Hadoop",
    "spark": "Apache Spark",
    "apache spark": "Apache Spark",
    "pyspark": "Apache Spark",
    "kafka": "Apache Kafka",
    "apache kafka": "Apache Kafka",
    "airflow": "Apache Airflow",
    "apache airflow": "Apache Airflow",

    # Mobile
    "react native": "React Native",
    "rn": "React Native",
    "flutter": "Flutter",
    "swift": "Swift",
    "swiftui": "SwiftUI",
    "objective-c": "Objective-C",
    "android": "Android",
    "ios": "iOS",

    # Tools & Practices
    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",
    "bitbucket": "Bitbucket",
    "jira": "Jira",
    "confluence": "Confluence",
    "slack": "Slack",
    "figma": "Figma",
    "sketch": "Sketch",
    "adobe xd": "Adobe XD",

    # APIs & Architecture
    "rest": "REST API",
    "rest api": "REST API",
    "restful": "REST API",
    "graphql": "GraphQL",
    "grpc": "gRPC",
    "websocket": "WebSockets",
    "websockets": "WebSockets",
    "microservices": "Microservices",
    "micro services": "Microservices",
    "system design": "System Design",
    "distributed systems": "Distributed Systems",
    "event driven": "Event-Driven Architecture",
    "message queue": "Message Queues",
    "rabbitmq": "RabbitMQ",
    "celery": "Celery",

    # Frontend
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "sass": "Sass",
    "scss": "Sass",
    "less": "Less",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "material ui": "Material UI",
    "mui": "Material UI",
    "styled components": "Styled Components",
    "webpack": "Webpack",
    "vite": "Vite",
    "babel": "Babel",
    "jquery": "jQuery",

    # Testing
    "jest": "Jest",
    "mocha": "Mocha",
    "pytest": "Pytest",
    "junit": "JUnit",
    "selenium": "Selenium",
    "cypress": "Cypress",
    "playwright": "Playwright",
    "tdd": "Test-Driven Development",
    "test driven development": "Test-Driven Development",
    "unit testing": "Unit Testing",
    "integration testing": "Integration Testing",

    # Security
    "oauth": "OAuth",
    "oauth2": "OAuth",
    "jwt": "JWT",
    "json web token": "JWT",
    "cybersecurity": "Cybersecurity",
    "penetration testing": "Penetration Testing",
    "pen testing": "Penetration Testing",
    "cryptography": "Cryptography",
    "owasp": "OWASP",

    # Methodologies
    "agile": "Agile",
    "scrum": "Scrum",
    "kanban": "Kanban",
    "devops": "DevOps",
    "sre": "Site Reliability Engineering",

    # CS Fundamentals
    "data structures": "Data Structures",
    "algorithms": "Algorithms",
    "dsa": "Data Structures",
    "oop": "Object-Oriented Programming",
    "object oriented programming": "Object-Oriented Programming",
    "object-oriented programming": "Object-Oriented Programming",
    "functional programming": "Functional Programming",
    "design patterns": "Design Patterns",

    # OS / Scripting
    "linux": "Linux",
    "ubuntu": "Ubuntu",
    "bash": "Bash",
    "shell": "Shell Scripting",
    "shell scripting": "Shell Scripting",
    "powershell": "PowerShell",

    # Other
    "sql": "SQL",
    "nosql": "NoSQL",
    "xml": "XML",
    "json": "JSON",
    "yaml": "YAML",
    "regex": "Regular Expressions",
    "regular expressions": "Regular Expressions",
    "blockchain": "Blockchain",
    "smart contracts": "Smart Contracts",
    "solidity": "Solidity",
    "web3": "Web3",
    "unity": "Unity",
    "unreal engine": "Unreal Engine",
    "game development": "Game Development",
    "ui/ux": "UI/UX Design",
    "ui ux": "UI/UX Design",
    "ux design": "UI/UX Design",
    "ui design": "UI/UX Design",
    "wireframing": "Wireframing",
    "prototyping": "Prototyping",
    "responsive design": "Responsive Design",
    "accessibility": "Accessibility",
    "a11y": "Accessibility",
    "seo": "SEO",
    "php": "PHP",
    "laravel": "Laravel",
    "ruby": "Ruby",
    "ruby on rails": "Ruby on Rails",
    "rails": "Ruby on Rails",
    "ror": "Ruby on Rails",
    "r": "R",
    "matlab": "MATLAB",
    "perl": "Perl",
    "haskell": "Haskell",
    "elixir": "Elixir",
    "erlang": "Erlang",
    "clojure": "Clojure",
    "dart": "Dart",
    "lua": "Lua",
    "assembly": "Assembly",
    "redux": "Redux",
    "zustand": "Zustand",
    "mobx": "MobX",
    "rxjs": "RxJS",
    "socket.io": "Socket.IO",
    "prisma": "Prisma",
    "mongoose": "Mongoose",
    "sequelize": "Sequelize",
    "typeorm": "TypeORM",
    "hibernate": "Hibernate",
    "swagger": "Swagger",
    "openapi": "OpenAPI",
    "postman": "Postman",
    "grafana": "Grafana",
    "prometheus": "Prometheus",
    "datadog": "Datadog",
    "new relic": "New Relic",
    "elastic stack": "ELK Stack",
    "elk": "ELK Stack",
    "splunk": "Splunk",
    "vagrant": "Vagrant",
    "packer": "Packer",
    "consul": "Consul",
    "vault": "HashiCorp Vault",
    "istio": "Istio",
    "envoy": "Envoy",
    "service mesh": "Service Mesh",
    "three.js": "Three.js",
    "threejs": "Three.js",
    "webgl": "WebGL",
    "d3": "D3.js",
    "d3.js": "D3.js",
    "chart.js": "Chart.js",
    "storybook": "Storybook",
}

# The set of canonical skill names (all values from SYNONYM_MAP, deduplicated)
CANONICAL_SKILLS: set[str] = set(SYNONYM_MAP.values())

# Build a reverse lookup: lowercase alias → canonical
_LOWER_SYNONYM_MAP: dict[str, str] = {k.lower(): v for k, v in SYNONYM_MAP.items()}


def normalize_skill(raw: str) -> str | None:
    """
    Given a raw skill string, return its canonical form.
    Returns None if the skill is not in our dictionary.
    """
    cleaned = raw.strip().lower()
    if not cleaned:
        return None
    # Direct lookup
    canonical = _LOWER_SYNONYM_MAP.get(cleaned)
    if canonical:
        return canonical
    # Check if already canonical (case-insensitive)
    for c in CANONICAL_SKILLS:
        if c.lower() == cleaned:
            return c
    return None


def normalize_skill_lenient(raw: str) -> str:
    """
    Same as normalize_skill but returns the cleaned input if no canonical match found.
    Used when we want to keep unknown skills rather than discard them.
    """
    result = normalize_skill(raw)
    return result if result else raw.strip()
