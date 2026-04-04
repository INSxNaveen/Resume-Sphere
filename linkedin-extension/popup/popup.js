/**
 * Task 4: popup.js - Extension UI Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 1: Initialization
    // ═══════════════════════════════════════════════════════════════════════════════
    // isChromeRuntimeAvailable check helper
    function isChromeRuntimeAvailable() {
        try { return !!chrome?.runtime?.id; } catch { return false; }
    }

    if (!isChromeRuntimeAvailable()) return;

    // Deststructure with defaults
    const { 
        token = null, 
        userName = 'User', 
        userEmail = '', 
        autoApply = false, 
        threshold = 70, 
        dotnetBaseUrl = 'http://localhost:5000', 
        aiBaseUrl = 'http://localhost:8000' 
    } = await chrome.storage.local.get({
        token: null,
        userName: 'User',
        userEmail: '',
        autoApply: false,
        threshold: 70,
        dotnetBaseUrl: 'http://localhost:5000',
        aiBaseUrl: 'http://localhost:8000'
    });
    
    if (token) {
        showLoggedInView();
        loadProfile({ token, userName, userEmail, autoApply, threshold, dotnetBaseUrl, aiBaseUrl });
        loadStats();
    } else {
        showLoginView();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 2: Login Flow
    // ═══════════════════════════════════════════════════════════════════════════════
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const dotnetBaseUrl = document.getElementById('dotnetUrl').value || 'http://localhost:5000';

        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        loginError.style.display = 'none';

        try {
            const response = await fetch(`${dotnetBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                const fullName = data.user?.fullName || email.split('@')[0];
                await chrome.storage.local.set({
                    token: data.token,
                    userName: fullName,
                    userEmail: email,
                    dotnetBaseUrl: dotnetBaseUrl
                });
                const { autoApply = false, threshold = 70, aiBaseUrl = 'http://localhost:8000' } = await chrome.storage.local.get(['autoApply', 'threshold', 'aiBaseUrl']);
                showLoggedInView();
                loadProfile({ 
                    token: data.token, 
                    userName: fullName, 
                    userEmail: email, 
                    dotnetBaseUrl,
                    autoApply,
                    threshold,
                    aiBaseUrl
                });
            } else {
                showError('Invalid credentials', response.status);
            }
        } catch (err) {
            showError(err.message, err.status);
            showLoginView();
        } finally {
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 3: Load Profile
    // ═══════════════════════════════════════════════════════════════════════════════
    function loadProfile(data) {
        const userName = data.userName || 'User';
        document.getElementById('userName').textContent = userName;
        document.getElementById('userInitial').textContent = userName.charAt(0).toUpperCase();
        
        document.getElementById('autoApplyToggle').checked = data.autoApply || false;
        
        const threshold = data.threshold || 70;
        document.getElementById('thresholdSlider').value = threshold;
        document.getElementById('thresholdValue').textContent = threshold + '%';
        
        document.getElementById('dotnetUrl').value = data.dotnetBaseUrl || 'http://localhost:5000';
        document.getElementById('aiUrl').value = data.aiBaseUrl || 'http://localhost:8000';
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 4: Load Stats
    // ═══════════════════════════════════════════════════════════════════════════════
    let statsInterval = null;
    function startStatsRefresh() {
        stopStatsRefresh();
        statsInterval = setInterval(loadStats, 60000);
    }
    function stopStatsRefresh() {
        if (statsInterval) clearInterval(statsInterval);
    }

    async function loadStats() {
        const { token, dotnetBaseUrl } = await chrome.storage.local.get(['token', 'dotnetBaseUrl']);
        const dotnet = dotnetBaseUrl || 'http://localhost:5000';
        try {
            const response = await fetch(`${dotnet}/api/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (response.ok) {
                const apps = await response.json();
                updateStatsUI(apps);
                const lastSync = document.getElementById('lastSync');
                if (lastSync) {
                    lastSync.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
                }
            }
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    }

    function updateStatsUI(apps) {
        // Filter out 'Skipped' (1) and 'Failed' (2) based on .NET enum serialization
        const successfulApps = apps.filter(a => a.status === 'Applied' || a.status === 0);
        
        const total = successfulApps.length;
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekCount = successfulApps.filter(a => new Date(a.appliedAt) > lastWeek).length;
        
        const avgScore = successfulApps.length > 0 
            ? Math.round(successfulApps.reduce((acc, current) => acc + (current.matchScore || 0), 0) / successfulApps.length)
            : 0;

        document.getElementById('statApplied').textContent = total;
        document.getElementById('statWeek').textContent = weekCount;
        document.getElementById('statAvg').textContent = avgScore + '%';
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 5: Settings Persistence
    // ═══════════════════════════════════════════════════════════════════════════════
    document.getElementById('autoApplyToggle').addEventListener('change', (e) => {
        chrome.storage.local.set({ autoApply: e.target.checked });
    });

    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.getElementById('thresholdValue');
    const settingsPanel = document.getElementById('settingsPanel');
    const toggleSettingsBtn = document.getElementById('toggleSettings');

    thresholdSlider.addEventListener('input', (e) => {
        thresholdValue.textContent = e.target.value + '%';
    });

    thresholdSlider.addEventListener('change', (e) => {
        chrome.storage.local.set({ threshold: parseInt(e.target.value) });
    });

    toggleSettingsBtn.addEventListener('click', () => {
        const isHidden = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHidden ? 'block' : 'none';
    });

    // Test Connection
    document.getElementById('testConnectionBtn')?.addEventListener('click', async () => {
        const btn = document.getElementById('testConnectionBtn');
        const statusEl = document.getElementById('connectionStatus');
        const originalText = btn.textContent;
        
        btn.textContent = 'Testing...';
        btn.disabled = true;
        statusEl.style.display = 'block';
        statusEl.textContent = 'Checking endpoints...';

        const { dotnetBaseUrl, aiBaseUrl } = await chrome.storage.local.get(['dotnetBaseUrl', 'aiBaseUrl']);
        const dotnet = dotnetBaseUrl || 'http://localhost:5000';
        const ai = aiBaseUrl || 'http://localhost:8000';

        let dotnetOk = false;
        let aiOk = false;

        try {
            const r = await fetch(`${dotnet}/api/resume/active-profile`, { 
                method: 'HEAD',
                signal: AbortSignal.timeout(4000) 
            });
            dotnetOk = r.status !== 404;
        } catch (e) {
            console.warn('Dotnet test failed:', e);
        }

        try {
            const r = await fetch(`${ai}/docs`, { 
                method: 'HEAD',
                signal: AbortSignal.timeout(4000) 
            });
            aiOk = r.ok;
        } catch (e) {
            console.warn('AI test failed:', e);
        }

        statusEl.innerHTML = `
            <div style="margin-bottom: 4px;">.NET API: ${dotnetOk ? '<span style="color:#4ade80">✅ Connected</span>' : '<span style="color:#f87171">❌ Unreachable</span>'}</div>
            <div>AI Service: ${aiOk ? '<span style="color:#4ade80">✅ Connected</span>' : '<span style="color:#f87171">❌ Unreachable</span>'}</div>
        `;

        btn.textContent = originalText;
        btn.disabled = false;
    });

    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn.addEventListener('click', async () => {
        const dotnetBaseUrl = document.getElementById('dotnetUrl').value;
        const aiBaseUrl = document.getElementById('aiUrl').value;
        
        await chrome.storage.local.set({ dotnetBaseUrl, aiBaseUrl });
        
        const originalText = saveSettingsBtn.textContent;
        saveSettingsBtn.textContent = 'Saved ✓';
        setTimeout(() => {
            saveSettingsBtn.textContent = originalText;
        }, 2000);
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 6: Logout
    // ═══════════════════════════════════════════════════════════════════════════════
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    async function handleLogout() {
        await chrome.storage.local.remove(['token', 'userName', 'userEmail']);
        showLoginView();
        // Clear fields
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 7: Status Updates
    // ═══════════════════════════════════════════════════════════════════════════════
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'updateStatus') {
            document.getElementById('statusText').textContent = message.text;
        }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 8: View Toggles
    // ═══════════════════════════════════════════════════════════════════════════════
    function showLoggedInView() {
        document.getElementById('logged-out-view').classList.add('hidden');
        document.getElementById('logged-in-view').classList.remove('hidden');
    }

    function showLoginView() {
        document.getElementById('logged-in-view').classList.add('hidden');
        document.getElementById('logged-out-view').classList.remove('hidden');
    }

    document.getElementById('toggleSettings').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('settingsPanel').classList.toggle('open');
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // Section 9: Error Handling
    // ═══════════════════════════════════════════════════════════════════════════════
    function showError(message, status = '') {
        const errorMsg = status ? `Error ${status}: ${message}` : message;
        
        // Login Error (Logged-out view)
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = errorMsg;
            loginError.style.display = 'block';
        }

        // Detail Error (Logged-in view)
        const errorDetail = document.getElementById('errorDetail');
        if (errorDetail) {
            errorDetail.textContent = errorMsg;
            errorDetail.style.display = 'block';
            setTimeout(() => {
                errorDetail.style.display = 'none';
            }, 5000);
        }

        console.error('Extension Error:', errorMsg);
    }
});
