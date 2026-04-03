# Railway Multi-Service Deployment - ResumeSphere

This guide explains how to deploy the entire ResumeSphere project as a **Monorepo** on Railway. This structure consists of three independent services:
1.  **Main Backend** (.NET)
2.  **AI Service** (Python)
3.  **Frontend** (React)

---

## 1. Create a PostgreSQL Database
1.  In Railway, click **+ New** → **Database** → **Add PostgreSQL**.
2.  Wait for it to provision. 
3.  Go to the **Variables** tab of the PostgreSQL service and copy the `DATABASE_URL` (or use internal linking in step 3).

---

## 2. Deploy AI Service (Python)
1.  Click **+ New** → **GitHub Repo** → Select `Resume-Sphere`.
2.  **Settings**:
    *   **Root Directory**: `/Resume_Backend/ai_service`
    *   **Service Name**: `ai-service`
3.  **Variables**:
    *   `PORT`: `8000`
    *   `FRONTEND_URL`: `*` (Change to your static frontend URL later for security).

---

## 3. Deploy Main Backend (.NET)
1.  Click **+ New** → **GitHub Repo** → Select `Resume-Sphere`.
2.  **Settings**:
    *   **Root Directory**: `/Resume_Backend/ResumeAPI`
    *   **Service Name**: `main-backend`
3.  **Variables**:
    *   `ConnectionStrings__DefaultConnection`: `${{Postgres.DATABASE_URL}}` (Click "Insert Variable" and select Postgres URL).
    *   `AppSettings__Token`: A random key (at least 32 characters long).
    *   `AiService__BaseUrl`: `${{ai-service.RAILWAY_STATIC_URL}}` (Links to your AI Service).
    *   `Frontend__Url`: `${{frontend.RAILWAY_STATIC_URL}}` (Links to your Frontend).
    *   `EmailConfiguration__SmtpServer`: `smtp.gmail.com`
    *   `EmailConfiguration__Port`: `587`
    *   `EmailConfiguration__SenderEmail`: Your Gmail address.
    *   `EmailConfiguration__SenderPassword`: Your Gmail [App Password](https://support.google.com/accounts/answer/185833).

---

## 4. Deploy Frontend (React)
1.  Click **+ New** → **GitHub Repo** → Select `Resume-Sphere`.
2.  **Settings**:
    *   **Root Directory**: `/Resume_Frontend`
    *   **Service Name**: `frontend`
3.  **Variables**:
    *   `VITE_API_URL`: `${{main-backend.RAILWAY_STATIC_URL}}/api` (Links to your .NET backend).

---

## Final Verification Checklist
- [ ] **PostgreSQL**: Running.
- [ ] **AI-Service**: Running (Verify by visiting `static-url/health`).
- [ ] **Main-Backend**: Running (Verify by visiting `static-url/health`).
- [ ] **Frontend**: Running and connecting to the backend.

### Database Migrations
Migrations are now **automated**. When the `main-backend` service starts up on Railway, it will automatically detect your PostgreSQL database and apply any pending tables/schemas. No manual commands are required.
