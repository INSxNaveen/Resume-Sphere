# Resume-Sphere LinkedIn Extension

Chrome Extension that scores LinkedIn jobs against your Resume-Sphere profile and auto-applies to matching positions.

## Setup

1. Make sure Resume-Sphere backend is running:
   - .NET API:    http://localhost:5000
   - Python AI:   http://localhost:8000

2. Generate placeholder icons (first time only):
```bash
   cd linkedin-extension
   python generate_icons.py
```

3. Load the extension in Chrome:
   - Open Chrome → chrome://extensions
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `linkedin-extension/` folder
   - The Resume-Sphere icon will appear in your toolbar

4. Click the extension icon → Sign in with your Resume-Sphere account

5. Go to any LinkedIn job listing — you will see a match score badge appear

## Configuration

Click "Extension Settings" in the popup to change the backend URLs if you are running on a different port or a deployed server.

## Phase Status

- [x] Phase 1 — Backend API endpoints
- [x] Phase 2 — AI screen-answer endpoint
- [x] Phase 3 — Extension core (this folder)
- [ ] Phase 4 — Auto-apply form filler
- [ ] Phase 5 — React dashboard + polish
