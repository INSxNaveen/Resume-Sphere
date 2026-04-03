"""
Fix partial EF migration state + run all API tests
"""
import sys
import time
import requests

# ─── Step 1: Fix DB via psycopg2 ─────────────────────────────────────────────
try:
    import psycopg2
    HAS_PG = True
except ImportError:
    HAS_PG = False
    print("psycopg2 not available - skipping DB fix")

if HAS_PG:
    conn = psycopg2.connect(
        host="localhost", port=5432, dbname="ResumeMatcherDb",
        user="postgres", password="root"
    )
    conn.autocommit = True
    cur = conn.cursor()

    # Check existing tables
    cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
    tables = {r[0] for r in cur.fetchall()}
    print(f"Existing tables ({len(tables)}): {sorted(tables)}")

    # Check Users Id type
    cur.execute("SELECT data_type FROM information_schema.columns WHERE table_name='Users' AND column_name='Id'")
    row = cur.fetchone()
    id_type = row[0] if row else "unknown"
    print(f"Users.Id type: {id_type}")

    # Check migration history
    cur.execute('SELECT "MigrationId" FROM "__EFMigrationsHistory" ORDER BY "MigrationId"')
    history = [r[0] for r in cur.fetchall()]
    print(f"Applied migrations: {history}")

    MIG_ID = "20260325090622_AddFullResumeSphereSchema"
    if MIG_ID not in history:
        cur.execute(
            'INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES (%s, %s)',
            (MIG_ID, '8.0.0')
        )
        print(f"Inserted migration record: {MIG_ID}")
    else:
        print(f"Migration already in history: {MIG_ID}")

    # Create missing tables in dependency order
    needed = [
        ("JobDescriptions", '''
            CREATE TABLE IF NOT EXISTS "JobDescriptions" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "RawText" text NOT NULL DEFAULT '',
                "NormalizedText" text NOT NULL DEFAULT '',
                "RoleTitle" character varying(256) NOT NULL DEFAULT '',
                "CompanyName" character varying(256),
                "ExperienceLevel" character varying(128),
                "CreatedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_JobDescriptions" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_JobDescriptions_Users_UserId" FOREIGN KEY ("UserId")
                    REFERENCES "Users" ("Id") ON DELETE CASCADE
            )'''),
        ("Analyses", '''
            CREATE TABLE IF NOT EXISTS "Analyses" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "ResumeId" uuid NOT NULL,
                "JobDescriptionId" uuid NOT NULL,
                "OverallScore" numeric(5,2) NOT NULL DEFAULT 0,
                "ScoreBreakdownJson" jsonb NOT NULL DEFAULT '{}',
                "Status" character varying(32) NOT NULL DEFAULT \'Pending\',
                "CreatedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_Analyses" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_Analyses_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_Analyses_Resumes_ResumeId" FOREIGN KEY ("ResumeId") REFERENCES "Resumes"("Id") ON DELETE RESTRICT,
                CONSTRAINT "FK_Analyses_JobDescriptions_JobDescriptionId" FOREIGN KEY ("JobDescriptionId") REFERENCES "JobDescriptions"("Id") ON DELETE RESTRICT
            )'''),
        ("ResumeExtractedSkills", '''
            CREATE TABLE IF NOT EXISTS "ResumeExtractedSkills" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "ResumeId" uuid NOT NULL,
                "SkillName" character varying(256) NOT NULL DEFAULT '',
                "Confidence" numeric(4,3) NOT NULL DEFAULT 1,
                CONSTRAINT "PK_ResumeExtractedSkills" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_ResumeExtractedSkills_Resumes_ResumeId" FOREIGN KEY ("ResumeId") REFERENCES "Resumes"("Id") ON DELETE CASCADE
            )'''),
        ("JobDescriptionExtractedSkills", '''
            CREATE TABLE IF NOT EXISTS "JobDescriptionExtractedSkills" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "JobDescriptionId" uuid NOT NULL,
                "SkillName" character varying(256) NOT NULL DEFAULT '',
                "IsRequired" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_JobDescriptionExtractedSkills" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_JobDescriptionExtractedSkills_JobDescriptions_JobDescriptionId" FOREIGN KEY ("JobDescriptionId") REFERENCES "JobDescriptions"("Id") ON DELETE CASCADE
            )'''),
        ("AnalysisMissingSkills", '''
            CREATE TABLE IF NOT EXISTS "AnalysisMissingSkills" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "AnalysisId" uuid NOT NULL,
                "SkillName" character varying(256) NOT NULL DEFAULT '',
                "Priority" character varying(32) NOT NULL DEFAULT \'Medium\',
                "WhyItMatters" text NOT NULL DEFAULT '',
                "Decision" character varying(32) NOT NULL DEFAULT \'Pending\',
                CONSTRAINT "PK_AnalysisMissingSkills" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_AnalysisMissingSkills_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE CASCADE
            )'''),
        ("AnalysisMissingKeywords", '''
            CREATE TABLE IF NOT EXISTS "AnalysisMissingKeywords" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "AnalysisId" uuid NOT NULL,
                "Keyword" character varying(256) NOT NULL DEFAULT '',
                "WhereItMatters" text NOT NULL DEFAULT '',
                CONSTRAINT "PK_AnalysisMissingKeywords" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_AnalysisMissingKeywords_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE CASCADE
            )'''),
        ("AnalysisSuggestions", '''
            CREATE TABLE IF NOT EXISTS "AnalysisSuggestions" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "AnalysisId" uuid NOT NULL,
                "Type" character varying(64) NOT NULL DEFAULT '',
                "OriginalText" text NOT NULL DEFAULT '',
                "SuggestedText" text NOT NULL DEFAULT '',
                "Reason" text NOT NULL DEFAULT '',
                CONSTRAINT "PK_AnalysisSuggestions" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_AnalysisSuggestions_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE CASCADE
            )'''),
        ("CourseRecommendations", '''
            CREATE TABLE IF NOT EXISTS "CourseRecommendations" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "AnalysisId" uuid NOT NULL,
                "SkillName" character varying(256) NOT NULL DEFAULT '',
                "Priority" character varying(32) NOT NULL DEFAULT \'Medium\',
                "Difficulty" character varying(32) NOT NULL DEFAULT \'Beginner\',
                "EstimatedHours" integer NOT NULL DEFAULT 10,
                "FreeResourceTitle" character varying(512) NOT NULL DEFAULT '',
                "FreeResourceUrl" character varying(2048) NOT NULL DEFAULT '',
                "PaidResourceTitle" character varying(512) NOT NULL DEFAULT '',
                "PaidResourceUrl" character varying(2048) NOT NULL DEFAULT '',
                "PracticeProject" text NOT NULL DEFAULT '',
                CONSTRAINT "PK_CourseRecommendations" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_CourseRecommendations_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE CASCADE
            )'''),
        ("UserCourseSelections", '''
            CREATE TABLE IF NOT EXISTS "UserCourseSelections" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "CourseRecommendationId" uuid NOT NULL,
                "SelectedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_UserCourseSelections" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_UserCourseSelections_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_UserCourseSelections_CourseRecommendations_CourseRecommendationId" FOREIGN KEY ("CourseRecommendationId") REFERENCES "CourseRecommendations"("Id") ON DELETE CASCADE
            )'''),
        ("UserCourseProgress", '''
            CREATE TABLE IF NOT EXISTS "UserCourseProgress" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "CourseRecommendationId" uuid NOT NULL,
                "PercentComplete" integer NOT NULL DEFAULT 0,
                "LastUpdatedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_UserCourseProgress" PRIMARY KEY ("Id"),
                CONSTRAINT "CK_UserCourseProgress_PercentComplete" CHECK ("PercentComplete" >= 0 AND "PercentComplete" <= 100),
                CONSTRAINT "FK_UserCourseProgress_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_UserCourseProgress_CourseRecommendations_CourseRecommendationId" FOREIGN KEY ("CourseRecommendationId") REFERENCES "CourseRecommendations"("Id") ON DELETE CASCADE
            )'''),
        ("GeneratedResumes", '''
            CREATE TABLE IF NOT EXISTS "GeneratedResumes" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "AnalysisId" uuid NOT NULL,
                "RoleTitle" character varying(256) NOT NULL DEFAULT '',
                "ContentJson" jsonb NOT NULL DEFAULT '{}',
                "PlainText" text NOT NULL DEFAULT '',
                "GeneratedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                "Version" integer NOT NULL DEFAULT 1,
                CONSTRAINT "PK_GeneratedResumes" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_GeneratedResumes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_GeneratedResumes_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE RESTRICT
            )'''),
        ("AnalysisHistories", '''
            CREATE TABLE IF NOT EXISTS "AnalysisHistories" (
                "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "UserId" uuid NOT NULL,
                "AnalysisId" uuid NOT NULL,
                "EventType" character varying(64) NOT NULL DEFAULT '',
                "EventDetail" text NOT NULL DEFAULT '',
                "OccurredAt" timestamp with time zone NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_AnalysisHistories" PRIMARY KEY ("Id"),
                CONSTRAINT "FK_AnalysisHistories_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_AnalysisHistories_Analyses_AnalysisId" FOREIGN KEY ("AnalysisId") REFERENCES "Analyses"("Id") ON DELETE CASCADE
            )'''),
    ]

    for (tname, sql) in needed:
        try:
            cur.execute(sql)
            status = "EXISTS" if tname in tables else "CREATED"
            print(f"  {tname}: {status}")
        except Exception as e:
            print(f"  {tname}: ERROR - {e}")

    cur.close()
    conn.close()
    print("\nDB fix complete.")
else:
    print("Skipping DB fix (psycopg2 not installed)")

# ─── Step 2: API Tests ────────────────────────────────────────────────────────
BASE_URL = "http://localhost:5006"
TIMEOUT  = 15
passed = failed = 0

def ok(name, detail=""):
    global passed; passed += 1
    print(f"  [PASS] {name}" + (f" -- {detail}" if detail else ""))

def fail(name, detail=""):
    global failed; failed += 1
    print(f"  [FAIL] {name}" + (f" -- {detail}" if detail else ""))

def check(name, resp, expected, fn=None):
    if resp.status_code == expected:
        if fn:
            try:
                data = resp.json()
                r = fn(data)
                if r is not True:
                    fail(name, f"assertion: {r}"); return None
            except Exception as e:
                fail(name, str(e)); return None
        ok(name, f"HTTP {resp.status_code}")
        try: return resp.json()
        except: return {}
    else:
        try: body = str(resp.json())[:150]
        except: body = resp.text[:150]
        fail(name, f"expected {expected}, got {resp.status_code} | {body}")
        return None

print("\n" + "="*60)
print("  API TESTS")
print("="*60)

# Wait for server
for i in range(20):
    try:
        r = requests.get(f"{BASE_URL}/swagger/v1/swagger.json", timeout=3)
        if r.status_code == 200:
            ok("Server health check", f"attempt {i+1}")
            break
    except: pass
    time.sleep(1)
else:
    fail("Server not responding"); sys.exit(1)

# AUTH
T = int(time.time())
EMAIL = f"test_{T}@resumesphere.io"
PASS  = "Test@12345!"

r = requests.post(f"{BASE_URL}/api/auth/register", json={}, timeout=TIMEOUT)
check("Register empty body -> 400", r, 400)

r = requests.post(f"{BASE_URL}/api/auth/register",
    json={"fullName": "Jane Test", "email": EMAIL, "password": PASS}, timeout=TIMEOUT)
reg = check("Register new user -> 200", r, 200,
    lambda d: True if "token" in d and d["user"]["email"] == EMAIL else f"body={d}")
TOKEN = reg["token"] if reg else None
if reg: print(f"  UserId={reg['user']['id']}")

r = requests.post(f"{BASE_URL}/api/auth/register",
    json={"fullName": "Jane Test", "email": EMAIL, "password": PASS}, timeout=TIMEOUT)
check("Register duplicate -> 400", r, 400)

r = requests.post(f"{BASE_URL}/api/auth/login",
    json={"email": EMAIL, "password": PASS}, timeout=TIMEOUT)
log = check("Login correct -> 200", r, 200, lambda d: True if "token" in d else "no token")
if log: TOKEN = log["token"]

r = requests.post(f"{BASE_URL}/api/auth/login",
    json={"email": EMAIL, "password": "WrongPass!"}, timeout=TIMEOUT)
check("Login wrong pass -> 400", r, 400)

AUTH = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}

# RESUME
r = requests.get(f"{BASE_URL}/api/resume", timeout=TIMEOUT)
check("GET /resume no auth -> 401", r, 401)

from pathlib import Path

# Build a minimal but valid PDF binary that real PDF parsers (PdfPig) can read.
def _make_minimal_pdf(text: str) -> bytes:
    """
    Produces a self-contained single-page PDF 1.4 document.
    The page has one content stream with the supplied text rendered in
    Helvetica 12pt.  All offsets are computed so the xref table is valid.
    """
    # Escape parentheses for the PDF string literal
    safe = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

    content_stream = (
        f"BT\n/F1 12 Tf\n50 750 Td\n({safe}) Tj\nET\n"
    ).encode()
    clen = len(content_stream)

    parts: list[bytes] = []
    offsets: list[int] = []

    header = b"%PDF-1.4\n"
    parts.append(header)
    cur = len(header)

    def add_obj(obj_bytes: bytes) -> int:
        nonlocal cur
        offsets.append(cur)
        parts.append(obj_bytes)
        cur += len(obj_bytes)
        return len(offsets)          # 1-based object number

    # Object 1 – Catalog
    add_obj(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # Object 2 – Pages
    add_obj(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # Object 3 – Page
    add_obj(
        b"3 0 obj\n"
        b"<< /Type /Page /Parent 2 0 R "
        b"/MediaBox [0 0 612 792] "
        b"/Contents 4 0 R "
        b"/Resources << /Font << /F1 5 0 R >> >> >>\n"
        b"endobj\n"
    )
    # Object 4 – Content stream
    add_obj(
        f"4 0 obj\n<< /Length {clen} >>\nstream\n".encode()
        + content_stream
        + b"\nendstream\nendobj\n"
    )
    # Object 5 – Font
    add_obj(
        b"5 0 obj\n"
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n"
        b"endobj\n"
    )

    n = len(offsets)
    xref_offset = cur
    xref = f"xref\n0 {n + 1}\n0000000000 65535 f \n".encode()
    for off in offsets:
        xref += f"{off:010d} 00000 n \n".encode()

    trailer = (
        f"trailer\n<< /Size {n + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n"
    ).encode()

    return b"".join(parts) + xref + trailer


resume_text = (
    "Jane Doe | jane@example.com  "
    "Skills: Python JavaScript React PostgreSQL Docker ASP.NET Core REST API Git TypeScript SQL  "
    "Experience: Software Engineer at TechCorp 2021-2024  "
    "Education: BSc Computer Science"
)

pdf = Path("test_resume_tmp.pdf")
pdf.write_bytes(_make_minimal_pdf(resume_text))

with open(pdf, "rb") as f:
    r = requests.post(f"{BASE_URL}/api/resume/upload",
        files={"file": ("r.pdf", f, "application/pdf")}, headers=AUTH, timeout=TIMEOUT)
up = check("POST /resume/upload valid -> 200", r, 200,
    lambda d: True if "resumeId" in d else f"body={d}")
RESUME_ID = up["resumeId"] if up else None
if up:
    print(f"  ResumeId={RESUME_ID}")
    print(f"  Skills={up.get('extractedSkills',[])[:5]}")
pdf.unlink(missing_ok=True)

r = requests.get(f"{BASE_URL}/api/resume", headers=AUTH, timeout=TIMEOUT)
check("GET /resume auth -> 200 list", r, 200, lambda d: True if isinstance(d, list) else "not list")

if RESUME_ID:
    r = requests.get(f"{BASE_URL}/api/resume/{RESUME_ID}/skills", headers=AUTH, timeout=TIMEOUT)
    check("GET /resume/{id}/skills -> 200", r, 200,
        lambda d: True if isinstance(d, list) and len(d) > 0 else f"empty={d}")

# JOBS
r = requests.get(f"{BASE_URL}/api/jobs", timeout=TIMEOUT)
check("GET /jobs -> 200 list", r, 200, lambda d: True if isinstance(d, list) else "not list")

r = requests.post(f"{BASE_URL}/api/jobs/match",
    json={"resumeId": "00000000-0000-0000-0000-000000000000", "topN": 5}, timeout=TIMEOUT)
check("POST /jobs/match bad resumeId -> 404", r, 404)

if RESUME_ID:
    r = requests.post(f"{BASE_URL}/api/jobs/match",
        json={"resumeId": RESUME_ID, "topN": 5}, timeout=TIMEOUT)
    m = check("POST /jobs/match valid -> 200", r, 200,
        lambda d: True if isinstance(d, list) and len(d) > 0 else f"bad={d}")
    if m: print(f"  Top: {m[0].get('title')} score={m[0].get('matchScore')}%")

# SKILL GAP
r = requests.get(f"{BASE_URL}/api/skill-gap",
    params={"resumeId": "00000000-0000-0000-0000-000000000000", "jobId": 1}, timeout=TIMEOUT)
check("GET /skill-gap bad resumeId -> 404", r, 404)

if RESUME_ID:
    r = requests.get(f"{BASE_URL}/api/skill-gap",
        params={"resumeId": RESUME_ID, "jobId": 1}, timeout=TIMEOUT)
    g = check("GET /skill-gap valid -> 200", r, 200,
        lambda d: True if "matchScore" in d else f"bad={d}")
    if g: print(f"  MatchScore={g.get('matchScore')}%")

# RESOURCES
r = requests.get(f"{BASE_URL}/api/resources/supported-skills", timeout=TIMEOUT)
check("GET /resources/supported-skills -> 200", r, 200,
    lambda d: True if isinstance(d, list) and len(d) > 0 else "empty")

for skill in ["Python", "React", "PostgreSQL", "Docker"]:
    r = requests.get(f"{BASE_URL}/api/resources/{skill}", timeout=TIMEOUT)
    check(f"GET /resources/{skill} -> 200", r, 200, lambda d: True if "skill" in d else f"bad={d}")

total = passed + failed
print(f"\n{'='*60}")
print(f"  RESULTS: {passed} passed  {failed} failed  (total {total})")
print(f"{'='*60}\n")
if failed > 0:
    sys.exit(1)
