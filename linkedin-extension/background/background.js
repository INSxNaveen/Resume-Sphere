/**
 * Task 5: background.js - MV3 Service Worker
 */

const DEFAULT_DOTNET_URL = 'http://localhost:5000';
const DEFAULT_AI_URL = 'http://localhost:8000';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Keep channel open for async response
});

async function handleMessage(message, sender) {
    switch (message.action) {
        case 'scoreJob':
            return await scoreJob(message);
        case 'getProfile':
            return await getProfile();
        case 'logApplication':
            return await logApplication(message);
        case 'screenAnswer':
            return await screenAnswer(message);
        case 'showNotification':
            return await showNotification(message);
        default:
            return { success: false, error: 'Unknown action' };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Network Actions
// ═══════════════════════════════════════════════════════════════════════════════

async function scoreJob({ jobDescription, jobTitle, company }) {
    try {
        const settings = await chrome.storage.local.get(['token', 'aiBaseUrl']);
        if (!settings.token) return { success: false, error: 'AUTH_REQUIRED' };

        const profileRes = await getProfile();
        if (!profileRes.success) return profileRes;

        const aiUrl = settings.aiBaseUrl || DEFAULT_AI_URL;
        const response = await fetch(`${aiUrl}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resume_text: profileRes.profile.resumeText,
                job_description: jobDescription
            })
        });

        if (!response.ok) throw new Error('AI analysis failed');
        const data = await response.json();

        return { 
            success: true, 
            score: data.score || 0,
            jobTitle,
            company
        };
    } catch (err) {
        console.error('Score action failed:', err);
        return { success: false, error: err.message };
    }
}

async function getProfile() {
    const settings = await chrome.storage.local.get(['token', 'dotnetBaseUrl', 'cachedProfile', 'profileCachedAt']);
    if (!settings.token) return { success: false, error: 'AUTH_REQUIRED' };

    // Cache check (1 hour)
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (settings.cachedProfile && (now - (settings.profileCachedAt || 0)) < oneHour) {
        return { success: true, profile: settings.cachedProfile };
    }

    try {
        const dotnet = settings.dotnetBaseUrl || DEFAULT_DOTNET_URL;
        const response = await fetch(`${dotnet}/api/resume/active-profile`, {
            headers: { 'Authorization': `Bearer ${settings.token}` }
        });

        if (response.status === 401) {
            await chrome.storage.local.remove(['token', 'userName', 'userEmail']);
            return { success: false, error: 'AUTH_EXPIRED' };
        }

        if (!response.ok) throw new Error('Profile fetch failed');
        const data = await response.json();
        
        await chrome.storage.local.set({
            cachedProfile: data,
            profileCachedAt: now
        });

        return { success: true, profile: data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function logApplication(payload) {
    try {
        const settings = await chrome.storage.local.get(['token', 'dotnetBaseUrl']);
        if (!settings.token) return { success: false, error: 'AUTH_REQUIRED' };

        const dotnet = settings.dotnetBaseUrl || DEFAULT_DOTNET_URL;
        const response = await fetch(`${dotnet}/api/applications`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.token}`
            },
            body: JSON.stringify({
                jobTitle: payload.jobTitle,
                companyName: payload.company, // Match .NET model 'CompanyName'
                linkedInJobUrl: payload.linkedInJobUrl,
                matchScore: payload.matchScore,
                status: payload.status || 'Applied'
            })
        });

        if (response.status === 401) {
            await chrome.storage.local.remove(['token', 'userName', 'userEmail']);
            return { success: false, error: 'AUTH_EXPIRED' };
        }

        if (!response.ok) throw new Error('Logging failed');
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function screenAnswer(message) {
    try {
        const { aiBaseUrl } = await chrome.storage.local.get('aiBaseUrl');
        const base = aiBaseUrl || DEFAULT_AI_URL;
        
        const response = await fetch(`${base}/screen-answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resume_text: message.resumeText,
                question: message.question,
                question_type: message.questionType,
                options: message.options || null
            })
        });

        if (!response.ok) throw new Error('AI analysis failed');
        const data = await response.json();
        
        return { 
            success: true, 
            answer: data.answer, 
            confidence: data.confidence, 
            reasoning: data.reasoning 
        };
    } catch (err) {
        console.error('Screen answer failed:', err);
        return { success: false, error: err.message };
    }
}

async function showNotification(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '/icons/icon48.png',
        title: message.title || 'Resume-Sphere',
        message: message.message || ''
    });
    return { success: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Alarms & Background Tasks
// ═══════════════════════════════════════════════════════════════════════════════

chrome.alarms.create('checkJobs', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkJobs') {
        console.log('Resume-Sphere: Periodic check fired (scaffold for Phase 4)');
    }
});
