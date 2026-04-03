import urllib.request, json, urllib.parse, time

BASE = "http://localhost:5000"

def get_auth_header():
    t = int(time.time())
    email = f"verify_{t}@resumesphere.io"
    password = "Test@12345!"
    
    reg_url = f"{BASE}/api/auth/register"
    reg_body = json.dumps({
        "fullName": "Verify User",
        "email": email,
        "password": password
    }).encode()
    
    req = urllib.request.Request(reg_url, data=reg_body, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            token = data["token"]
            return {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    except Exception as e:
        print(f"Auth Error: {e}")
        return None

HEADERS = get_auth_header()
if not HEADERS:
    print("CRITICAL: Failed to get auth token. Is the server running on port 5000?")
    exit(1)

def get(path):
    req = urllib.request.Request(f"{BASE}{path}", headers=HEADERS, method='GET')
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        try: return e.code, e.read().decode()
        except: return e.code, str(e)

def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=HEADERS, method='POST')
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        try: return e.code, e.read().decode()
        except: return e.code, str(e)

PASS = "[PASS]"
FAIL = "[FAIL]"

print("=" * 70)
print("COMPLETE API PARAMETER VERIFICATION")
print("=" * 70)

# 1. GET /api/Resume (list all)
status, data = get("/api/Resume")
count = data.get('Count', len(data)) if isinstance(data, dict) else len(data)
result = PASS if status == 200 else FAIL
print(f"\n{result}  1. GET /api/Resume  [{status}]")
print(f"     -> {count} resume(s) stored")
resumes = data.get('value', data) if isinstance(data, dict) else data
if resumes:
    for r in resumes:
        print(f"        ID={r['id']}  File={r['fileName']}  UserId={r['userId']}")

# 2. GET /api/Resume/{id}/skills
resumes = data if isinstance(data, list) else data.get('value', [])
if resumes:
    RESUME_ID = resumes[0]['id']
    status, data = get(f"/api/Resume/{RESUME_ID}/skills")
    skills = data if isinstance(data, list) else data.get('value', [])
    result = PASS if status == 200 and len(skills) > 0 else FAIL
    print(f"\n{result}  2. GET /api/Resume/{RESUME_ID}/skills  [{status}]")
    print(f"     -> {len(skills)} skills: {skills[:5]}...")
else:
    print("\n[SKIP] 2. No resumes found to test skills.")

# 3. GET /api/Resume/00000000-0000-0000-0000-000000000000/skills (invalid id)
status, data = get("/api/Resume/00000000-0000-0000-0000-000000000000/skills")
result = PASS if status == 404 else FAIL
print(f"\n{result}  3. GET /api/Resume/bad-id/skills (bad ID)  [{status}]")
print(f"     -> {data if isinstance(data, str) else json.dumps(data)[:80]}")

# 4. GET /api/Jobs
status, data = get("/api/Jobs")
jobs = data.get('value', data) if isinstance(data, dict) else data
result = PASS if status == 200 and len(jobs) == 10 else FAIL
print(f"\n{result}  4. GET /api/Jobs  [{status}]")
print(f"     -> {len(jobs)} jobs returned:")
for j in jobs:
    print(f"        #{j['id']}  {j['title']} @ {j['company']}  Skills={j['requiredSkills']}")

# 5. POST /api/Jobs/match with RESUME_ID, topN=10
if resumes:
    status, data = post("/api/Jobs/match", {"resumeId": RESUME_ID, "topN": 10})
    matches = data if isinstance(data, list) else data.get('value', [])
    result = PASS if status == 200 and len(matches) > 0 else FAIL
    print(f"\n{result}  5. POST /api/Jobs/match (resumeId={RESUME_ID}, topN=10)  [{status}]")
    if matches:
        m = matches[0]
        print(f"     -> Top: [{m['matchScore']}%] {m['title']} @ {m['company']}")
else:
    print("\n[SKIP] 5. No resumes found to test match.")

# 6. POST /api/Jobs/match with invalid resumeId
status, data = post("/api/Jobs/match", {"resumeId": "00000000-0000-0000-0000-000000000000", "topN": 5})
result = PASS if status == 404 else FAIL
print(f"\n{result}  6. POST /api/Jobs/match (invalid resumeId)  [{status}]")
print(f"     -> {data[:80] if isinstance(data, str) else json.dumps(data)[:80]}")

# 7. GET /api/skill-gap?resumeId={ID}&jobId=1 (Python Backend Dev)
if resumes:
    status, data = get(f"/api/skill-gap?resumeId={RESUME_ID}&jobId=1")
    result = PASS if status == 200 else FAIL
    print(f"\n{result}  7. GET /api/skill-gap?resumeId={RESUME_ID}&jobId=1  [{status}]")
    if status == 200:
        print(f"     -> Job: {data['jobTitle']} @ {data['company']} Score: {data['matchScore']}%")

# 8. GET /api/skill-gap?resumeId=...&jobId=3 (Data Scientist)
if resumes:
    status, data = get(f"/api/skill-gap?resumeId={RESUME_ID}&jobId=3")
    result = PASS if status == 200 else FAIL
    print(f"\n{result}  8. GET /api/skill-gap?resumeId={RESUME_ID}&jobId=3  [{status}]")

# 9. GET /api/skill-gap with invalid resumeId
status, data = get("/api/skill-gap?resumeId=00000000-0000-0000-0000-000000000000&jobId=1")
result = PASS if status == 404 else FAIL
print(f"\n{result}  9. GET /api/skill-gap (bad ID)  [{status}]")
print(f"     -> {data[:80] if isinstance(data, str) else json.dumps(data)[:80]}")

# 10. GET /api/Resources/supported-skills
status, data = get("/api/Resources/supported-skills")
skills_list = data.get('value', data) if isinstance(data, dict) else data
result = PASS if status == 200 and len(skills_list) == 30 else FAIL
print(f"\n{result} 10. GET /api/Resources/supported-skills  [{status}]")
print(f"     -> {len(skills_list)} skills: {skills_list}")

# 11. GET /api/Resources/Python
status, data = get("/api/Resources/Python")
result = PASS if status == 200 and len(data.get('youTubeLinks', [])) == 3 else FAIL
print(f"\n{result} 11. GET /api/Resources/Python  [{status}]")
if status == 200:
    print(f"     YouTube links ({len(data['youTubeLinks'])}):")
    for l in data['youTubeLinks']:
        print(f"        - {l['title']}")
    print(f"     Article links ({len(data['articleLinks'])}):")
    for l in data['articleLinks']:
        print(f"        - {l['title']}")

# 12. GET /api/Resources/Docker
status, data = get("/api/Resources/Docker")
result = PASS if status == 200 and len(data.get('youTubeLinks', [])) == 3 else FAIL
print(f"\n{result} 12. GET /api/Resources/Docker  [{status}]")
if status == 200:
    print(f"     YouTube: {[l['title'] for l in data['youTubeLinks']]}")
    print(f"     Articles: {[l['title'] for l in data['articleLinks']]}")

# 13. GET /api/Resources/Machine Learning
import urllib.parse
status, data = get("/api/Resources/" + urllib.parse.quote("Machine Learning"))
result = PASS if status == 200 and len(data.get('youTubeLinks', [])) == 3 else FAIL
print(f"\n{result} 13. GET /api/Resources/Machine Learning  [{status}]")
if status == 200:
    print(f"     YouTube: {[l['title'] for l in data['youTubeLinks']]}")
    print(f"     Articles: {[l['title'] for l in data['articleLinks']]}")

# 14. GET /api/Resources/UnknownSkill (fallback)
status, data = get("/api/Resources/Blockchain")
result = PASS if status == 200 else FAIL
print(f"\n{result} 14. GET /api/Resources/Blockchain (unknown skill - fallback)  [{status}]")
if status == 200:
    print(f"     YouTube: {[l['title'] for l in data['youTubeLinks']]}")
    print(f"     Articles: {[l['title'] for l in data['articleLinks']]}")

print("\n" + "=" * 70)
print("VERIFICATION COMPLETE")
print("=" * 70)
