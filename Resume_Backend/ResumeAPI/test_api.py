import urllib.request, json, time, os

BASE_URL = "http://localhost:5000"

def get_token():
    t = int(time.time())
    email = f"test_api_{t}@resumesphere.io"
    password = "Test@12345!"
    
    # Register/Login to get Token
    reg_url = f"{BASE_URL}/api/auth/register"
    reg_body = json.dumps({
        "fullName": "API Test User",
        "email": email,
        "password": password
    }).encode()
    
    req = urllib.request.Request(reg_url, data=reg_body, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return data["token"]
    except Exception as e:
        print(f"Error getting token: {e}")
        return None

TOKEN = get_token()
if not TOKEN:
    print("FAILED TO GET AUTH TOKEN")
    exit(1)

# Build a minimal but valid PDF binary that real PDF parsers (PdfPig) can read.
def _make_minimal_pdf(text: str) -> bytes:
    safe = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    content_stream = f"BT\n/F1 12 Tf\n50 750 Td\n({safe}) Tj\nET\n".encode()
    clen = len(content_stream)
    parts, offsets = [], []
    header = b"%PDF-1.4\n"
    parts.append(header)
    cur = len(header)
    def add_obj(obj_bytes):
        nonlocal cur
        offsets.append(cur)
        parts.append(obj_bytes)
        cur += len(obj_bytes)
    add_obj(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    add_obj(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    add_obj(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n")
    add_obj(f"4 0 obj\n<< /Length {clen} >>\nstream\n".encode() + content_stream + b"\nendstream\nendobj\n")
    add_obj(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    n = len(offsets)
    xref_offset = cur
    xref = f"xref\n0 {n + 1}\n0000000000 65535 f \n".encode()
    for off in offsets: xref += f"{off:010d} 00000 n \n".encode()
    trailer = f"trailer\n<< /Size {n + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode()
    return b"".join(parts) + xref + trailer

file_path = "test_resume.pdf"
with open(file_path, "wb") as f:
    f.write(_make_minimal_pdf("Jane Doe | Skills: Python JavaScript React"))
print(f"Created valid test PDF: {file_path}")

boundary = '----ResumeTestBoundary12345'
with open(file_path, 'rb') as f:
    file_data = f.read()

part_header = (
    '--' + boundary + '\r\n'
    'Content-Disposition: form-data; name="file"; filename="test_resume.pdf"\r\n'
    'Content-Type: application/pdf\r\n'
    '\r\n'
).encode()

body = part_header + file_data + ('\r\n--' + boundary + '--\r\n').encode()

req = urllib.request.Request(
    f'{BASE_URL}/api/resume/upload',
    data=body,
    headers={
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Authorization': f'Bearer {TOKEN}'
    },
    method='POST'
)
try:
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())
        print('UPLOAD STATUS: 200 OK')
        print(json.dumps(result, indent=2))
        resume_id = result.get('resumeId')
        
        # Match test
        match_body = json.dumps({'resumeId': resume_id, 'topN': 5}).encode()
        match_req = urllib.request.Request(
            f'{BASE_URL}/api/jobs/match',
            data=match_body,
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {TOKEN}'},
            method='POST'
        )
        with urllib.request.urlopen(match_req) as mr:
            matches = json.loads(mr.read().decode())
            print('JOB MATCH STATUS: 200 OK')
        
        # Skill gap test
        gap_req = urllib.request.Request(
            f'{BASE_URL}/api/skill-gap?resumeId={resume_id}&jobId=1',
            headers={'Authorization': f'Bearer {TOKEN}'},
            method='GET'
        )
        with urllib.request.urlopen(gap_req) as gr:
            gap = json.loads(gr.read().decode())
            print('SKILL GAP STATUS: 200 OK')
        
        # Skills test
        skills_req = urllib.request.Request(
            f'{BASE_URL}/api/resume/{resume_id}/skills',
            headers={'Authorization': f'Bearer {TOKEN}'},
            method='GET'
        )
        with urllib.request.urlopen(skills_req) as sr:
            skills = json.loads(sr.read().decode())
            print('RESUME SKILLS STATUS: 200 OK')
            
    # Cleanup
    if os.path.exists(file_path): os.remove(file_path)

except urllib.error.HTTPError as e:
    print('ERROR:', e.code, e.read().decode())
    if os.path.exists(file_path): os.remove(file_path)
