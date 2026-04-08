"""
Learning plan generator.
For each missing skill: why it matters, priority, difficulty, estimated hours,
one free resource, one paid resource, and one practice project idea.
"""

# Curated resource database (extensible)
SKILL_RESOURCES: dict[str, dict] = {
    "Python": {
        "free": {"title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/"},
        "paid": {"title": "Python for Everybody (Coursera)", "url": "https://www.coursera.org/specializations/python"},
        "project": "Build a CLI tool that analyzes CSV files and generates summary reports",
        "difficulty": "beginner",
        "hours": 15,
    },
    "JavaScript": {
        "free": {"title": "JavaScript.info Modern Tutorial", "url": "https://javascript.info/"},
        "paid": {"title": "The Complete JavaScript Course (Udemy)", "url": "https://www.udemy.com/course/the-complete-javascript-course/"},
        "project": "Build an interactive todo app with LocalStorage persistence",
        "difficulty": "beginner",
        "hours": 20,
    },
    "TypeScript": {
        "free": {"title": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/handbook/"},
        "paid": {"title": "Understanding TypeScript (Udemy)", "url": "https://www.udemy.com/course/understanding-typescript/"},
        "project": "Convert an existing JS project to TypeScript with strict mode",
        "difficulty": "intermediate",
        "hours": 12,
    },
    "React": {
        "free": {"title": "React Official Docs", "url": "https://react.dev/learn"},
        "paid": {"title": "React - The Complete Guide (Udemy)", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"},
        "project": "Build a recipe finder app with search, filtering, and state management",
        "difficulty": "intermediate",
        "hours": 25,
    },
    "Node.js": {
        "free": {"title": "Node.js Official Getting Started", "url": "https://nodejs.org/en/learn"},
        "paid": {"title": "The Complete Node.js Developer (Udemy)", "url": "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/"},
        "project": "Build a REST API for a bookstore with Express and MongoDB",
        "difficulty": "intermediate",
        "hours": 20,
    },
    "Docker": {
        "free": {"title": "Docker Getting Started Guide", "url": "https://docs.docker.com/get-started/"},
        "paid": {"title": "Docker and Kubernetes (Udemy)", "url": "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/"},
        "project": "Containerize a multi-service application with Docker Compose",
        "difficulty": "intermediate",
        "hours": 15,
    },
    "Kubernetes": {
        "free": {"title": "Kubernetes Official Tutorials", "url": "https://kubernetes.io/docs/tutorials/"},
        "paid": {"title": "CKA Certification Course (Udemy)", "url": "https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/"},
        "project": "Deploy a microservices app to a local K8s cluster with Minikube",
        "difficulty": "advanced",
        "hours": 30,
    },
    "Amazon Web Services": {
        "free": {"title": "AWS Free Tier + Skill Builder", "url": "https://explore.skillbuilder.aws/"},
        "paid": {"title": "AWS Solutions Architect Associate (Udemy)", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"},
        "project": "Deploy a serverless API using Lambda, API Gateway, and DynamoDB",
        "difficulty": "advanced",
        "hours": 30,
    },
    "Microsoft Azure": {
        "free": {"title": "Microsoft Learn Azure Fundamentals", "url": "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/"},
        "paid": {"title": "AZ-900 Azure Fundamentals (Udemy)", "url": "https://www.udemy.com/course/az900-azure/"},
        "project": "Deploy a web app with Azure App Service and Azure SQL",
        "difficulty": "intermediate",
        "hours": 20,
    },
    "Google Cloud Platform": {
        "free": {"title": "Google Cloud Skills Boost", "url": "https://www.cloudskillsboost.google/"},
        "paid": {"title": "GCP Associate Cloud Engineer (Coursera)", "url": "https://www.coursera.org/professional-certificates/cloud-engineering-gcp"},
        "project": "Build a data pipeline using Cloud Functions, Pub/Sub, and BigQuery",
        "difficulty": "advanced",
        "hours": 25,
    },
    "PostgreSQL": {
        "free": {"title": "PostgreSQL Official Documentation", "url": "https://www.postgresql.org/docs/current/tutorial.html"},
        "paid": {"title": "The Complete SQL Bootcamp (Udemy)", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/"},
        "project": "Design a normalized schema for an e-commerce app with indexes and views",
        "difficulty": "intermediate",
        "hours": 15,
    },
    "MongoDB": {
        "free": {"title": "MongoDB University Free Courses", "url": "https://learn.mongodb.com/"},
        "paid": {"title": "MongoDB - The Complete Developer's Guide (Udemy)", "url": "https://www.udemy.com/course/mongodb-the-complete-developers-guide/"},
        "project": "Build a blog platform backend with MongoDB aggregation pipelines",
        "difficulty": "intermediate",
        "hours": 15,
    },
    "Redis": {
        "free": {"title": "Redis University", "url": "https://university.redis.com/"},
        "paid": {"title": "Redis: The Complete Developer's Guide (Udemy)", "url": "https://www.udemy.com/course/redis-the-complete-developers-guide-p/"},
        "project": "Add Redis caching to an existing REST API to reduce DB load",
        "difficulty": "intermediate",
        "hours": 10,
    },
    "GraphQL": {
        "free": {"title": "How to GraphQL", "url": "https://www.howtographql.com/"},
        "paid": {"title": "GraphQL with React Course (Udemy)", "url": "https://www.udemy.com/course/graphql-with-react-course/"},
        "project": "Build a GraphQL API for a social media app with Apollo Server",
        "difficulty": "intermediate",
        "hours": 15,
    },
    "CI/CD": {
        "free": {"title": "GitHub Actions Documentation", "url": "https://docs.github.com/en/actions"},
        "paid": {"title": "DevOps with GitHub Actions (Udemy)", "url": "https://www.udemy.com/course/github-actions-the-complete-guide/"},
        "project": "Set up a CI/CD pipeline that runs tests, lints, and deploys to staging",
        "difficulty": "intermediate",
        "hours": 12,
    },
    "Machine Learning": {
        "free": {"title": "Andrew Ng's Machine Learning (Coursera - audit free)", "url": "https://www.coursera.org/learn/machine-learning"},
        "paid": {"title": "Machine Learning A-Z (Udemy)", "url": "https://www.udemy.com/course/machinelearning/"},
        "project": "Build a spam classifier using scikit-learn on a public email dataset",
        "difficulty": "advanced",
        "hours": 40,
    },
    "Terraform": {
        "free": {"title": "Terraform Getting Started", "url": "https://developer.hashicorp.com/terraform/tutorials"},
        "paid": {"title": "Terraform for AWS (Udemy)", "url": "https://www.udemy.com/course/terraform-beginner-to-advanced/"},
        "project": "Provision a VPC with EC2 instances and an RDS database using Terraform",
        "difficulty": "advanced",
        "hours": 20,
    },
    "SQL": {
        "free": {"title": "SQLBolt Interactive Tutorials", "url": "https://sqlbolt.com/"},
        "paid": {"title": "The Complete SQL Bootcamp (Udemy)", "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/"},
        "project": "Write complex queries with joins, window functions, and CTEs on a sample DB",
        "difficulty": "beginner",
        "hours": 12,
    },
    "Git": {
        "free": {"title": "Pro Git Book (free online)", "url": "https://git-scm.com/book/en/v2"},
        "paid": {"title": "Git Complete (Udemy)", "url": "https://www.udemy.com/course/git-complete/"},
        "project": "Manage a multi-branch workflow with rebasing, cherry-picking, and conflict resolution",
        "difficulty": "beginner",
        "hours": 8,
    },
    "Angular": {
        "free": {"title": "Angular Official Tutorial", "url": "https://angular.io/tutorial"},
        "paid": {"title": "Angular - The Complete Guide (Udemy)", "url": "https://www.udemy.com/course/the-complete-guide-to-angular-2/"},
        "project": "Build a task management dashboard with Angular routing and services",
        "difficulty": "intermediate",
        "hours": 25,
    },
}

# Default template for skills not in the curated database
DEFAULT_RESOURCE = {
    "difficulty": "intermediate",
    "hours": 15,
}


def generate_learning_plan(missing_skills: list[dict], role_title: str = "") -> list[dict]:
    """
    Generate a learning plan for each missing skill.
    Input: list of missing skill dicts from comparator (skill_name, priority, category, why_it_matters)
    Output: list of learning plan items with resources and projects.
    """
    plan = []

    for skill_info in missing_skills:
        skill_name = skill_info.get("skill_name", "Unknown")
        priority = skill_info.get("priority", "medium")
        why = skill_info.get("why_it_matters", f"Required for the {role_title} role." if role_title else "Required by the job description.")

        # Look up curated resources
        resources = SKILL_RESOURCES.get(skill_name, {})

        difficulty = resources.get("difficulty", DEFAULT_RESOURCE["difficulty"])
        hours = resources.get("hours", DEFAULT_RESOURCE["hours"])
        free_resource = resources.get("free", {
            "title": f"{skill_name} official documentation",
            "url": f"https://www.google.com/search?q={skill_name.replace(' ', '+')}+tutorial+official",
        })
        paid_resource = resources.get("paid", {
            "title": f"{skill_name} comprehensive course on Udemy",
            "url": f"https://www.udemy.com/courses/search/?q={skill_name.replace(' ', '+')}",
        })
        project = resources.get("project", f"Build a small project demonstrating {skill_name} in a real use case relevant to {role_title}." if role_title else f"Build a small project demonstrating {skill_name} in a real use case.")

        plan.append({
            "skill_name": skill_name,
            "priority": priority,
            "why_it_matters": why,
            "difficulty": difficulty,
            "estimated_hours": hours,
            "free_resource": free_resource,
            "paid_resource": paid_resource,
            "practice_project": project,
        })

    # Sort by priority: high > medium > low
    priority_order = {"high": 0, "medium": 1, "low": 2}
    plan.sort(key=lambda x: priority_order.get(x["priority"], 1))

    return plan


JOB_ROLES = [
    {
        "title": "Frontend Engineer",
        "core_skills": ["JavaScript", "TypeScript", "React", "Vue", "Angular", "HTML", "CSS", "Tailwind CSS"],
        "bonus_skills": ["Redux", "GraphQL", "Next.js", "Vite", "Jest"],
        "description": "Develop user-facing interfaces and web applications."
    },
    {
        "title": "Backend Engineer",
        "core_skills": ["Python", "Node.js", "Java", "C#", "Go", "PostgreSQL", "MongoDB", "REST API", "SQL"],
        "bonus_skills": ["Redis", "Docker", "AWS", "GraphQL", "Microservices"],
        "description": "Build robust server-side APIs and database architectures."
    },
    {
        "title": "Full Stack Engineer",
        "core_skills": ["JavaScript", "React", "Node.js", "Python", "SQL", "PostgreSQL"],
        "bonus_skills": ["Docker", "AWS", "TypeScript", "Next.js"],
        "description": "End-to-end web application development."
    },
    {
        "title": "DevOps Engineer",
        "core_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Bash", "Terraform"],
        "bonus_skills": ["Ansible", "Python", "Prometheus", "Grafana", "Google Cloud Platform"],
        "description": "Streamline deployments, infrastructure, and cloud architecture."
    },
    {
        "title": "Data Scientist",
        "core_skills": ["Python", "Machine Learning", "Pandas", "NumPy", "SQL", "Data Analysis"],
        "bonus_skills": ["Deep Learning", "TensorFlow", "PyTorch", "Data Visualization"],
        "description": "Extract insights and build predictive models from data."
    },
    {
        "title": "Mobile Engineer",
        "core_skills": ["React Native", "Flutter", "Swift", "Android", "iOS", "Kotlin"],
        "bonus_skills": ["JavaScript", "TypeScript", "Firebase", "REST API"],
        "description": "Build and publish mobile applications."
    }
]

def infer_jobs(resume_skills: list[str]) -> tuple[list[dict], list[dict], list[dict]]:
    """
    Given a list of skills, predict eligible jobs, next improvement suggestions,
    and aspirational (unlocked) opportunities.
    """
    resume_skills_lower = {s.lower() for s in resume_skills}
    eligible_jobs = []
    unlocked_opportunities = []
    
    # Global missing skills for improvement suggestions
    all_missing_core = {}

    for role in JOB_ROLES:
        core_matches = [s for s in role["core_skills"] if s.lower() in resume_skills_lower]
        bonus_matches = [s for s in role["bonus_skills"] if s.lower() in resume_skills_lower]
        
        missing_core = [s for s in role["core_skills"] if s.lower() not in resume_skills_lower]
        
        core_score = len(core_matches) / len(role["core_skills"]) if role["core_skills"] else 0
        
        if core_score >= 0.4:
            # Eligible job
            eligible_jobs.append({
                "title": role["title"],
                "fitReason": f"Matches {len(core_matches)} core skills.",
                "matchScore": int(core_score * 100),
                "missingSkills": missing_core[:3]
            })
            for ms in missing_core:
                if ms not in all_missing_core:
                    all_missing_core[ms] = {"count": 1, "roles": [role["title"]]}
                else:
                    all_missing_core[ms]["count"] += 1
                    all_missing_core[ms]["roles"].append(role["title"])
        elif core_score > 0.0:
            # Unlocked opportunity if they learn the missing bits
            unlocked_opportunities.append({
                "title": role["title"],
                "whyUnlocked": f"Can unlock by learning {', '.join(missing_core[:3])}",
                "requiredAddedSkills": missing_core
            })
            for ms in missing_core:
                if ms not in all_missing_core:
                    all_missing_core[ms] = {"count": 1, "roles": [role["title"]]}
                else:
                    all_missing_core[ms]["count"] += 1
                    all_missing_core[ms]["roles"].append(role["title"])

    # Sort eligible jobs by match score
    eligible_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
    unlocked_opportunities.sort(key=lambda x: len(x["requiredAddedSkills"]))
    
    # Generate improvement suggestions from the most needed skills
    sorted_missing = sorted(all_missing_core.items(), key=lambda x: x[1]["count"], reverse=True)
    improvement_suggestions = []
    for skill, data in sorted_missing[:5]:
        improvement_suggestions.append({
            "skill": skill,
            "reason": f"Required for {', '.join(data['roles'][:2])}",
            "priority": "High" if data["count"] > 1 else "Medium"
        })
        
    return eligible_jobs, improvement_suggestions, unlocked_opportunities

