/**
 * Task 6: content/content.js - LinkedIn DOM Management
 */

(async function init() {
    if (!isJobDetailPage()) return;
    
    // Check if we already injected a badge for this job
    if (document.getElementById('rs-score-badge')) return;

    const jobData = extractJobData();
    if (!jobData) return;

    injectLoadingBadge();
    const result = await scoreJob(jobData);
    updateBadge(result);
    
    const { autoApply, threshold } = await chrome.storage.local.get(['autoApply', 'threshold']);
    if (autoApply && result.success && result.score >= (threshold || 70)) {
        updateBadgeAutoApplyReady();
    }
    
    checkAutoApply(result, jobData);
})();

function updateBadgeAutoApplyReady() {
    const badge = document.getElementById('rs-score-badge');
    if (!badge) return;
    
    // Add pulse animation class
    badge.classList.add('rs-auto-ready');

    // Add AUTO pill if not exists
    if (!badge.querySelector('.rs-auto-pill')) {
        const pill = document.createElement('span');
        pill.className = 'rs-auto-pill';
        pill.style.marginLeft = '8px';
        pill.style.backgroundColor = 'rgba(255,255,255,0.2)';
        pill.style.padding = '2px 6px';
        pill.style.borderRadius = '4px';
        pill.style.fontSize = '10px';
        pill.textContent = 'AUTO';
        badge.appendChild(pill);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Selectors & Data Extraction
// ═══════════════════════════════════════════════════════════════════════════════

function isJobDetailPage() {
    // If we're anywhere within /jobs/, attempt extraction
    return window.location.href.includes('/jobs/');
}

function extractJobData() {
    try {
        // 1. Extract Job Title (looser tag requirements, handle h1/h2/div/span)
        const jobTitle = 
            document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText?.trim() ||
            document.querySelector('[class*="job-title"]')?.innerText?.trim() ||
            document.querySelector('.top-card-layout__title')?.innerText?.trim() ||
            document.querySelector('.topcard__title')?.innerText?.trim() ||
            document.querySelector('.job-view-layout h1')?.innerText?.trim() ||
            document.querySelector('.job-view-layout h2')?.innerText?.trim() ||
            document.querySelector('h2.t-24')?.innerText?.trim() ||
            document.querySelector('h1.t-24')?.innerText?.trim() ||
            document.title.split('|')[0].trim();

        // 2. Extract Company Name
        const company = 
            document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText?.trim() ||
            document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim() ||
            document.querySelector('.job-details-jobs-unified-top-card__primary-description a')?.innerText?.trim() ||
            document.querySelector('[class*="company-name"] a')?.innerText?.trim() ||
            document.querySelector('[class*="company-name"]')?.innerText?.trim() ||
            document.querySelector('.job-view-layout .t-14.t-black a')?.innerText?.trim() ||
            document.querySelector('a.topcard__org-name-link')?.innerText?.trim();

        // 3. Extract Job Description
        // Attempt CSS selectors first
        let jdResult = document.querySelector('.jobs-description__content')?.innerText?.trim() ||
                       document.querySelector('.jobs-description-content__text')?.innerText?.trim() ||
                       document.querySelector('#job-details')?.innerText?.trim() ||
                       document.querySelector('[class*="description__content"]')?.innerText?.trim() ||
                       document.querySelector('.jobs-box__html-content')?.innerText?.trim() ||
                       document.querySelector('.show-more-less-html__markup')?.innerText?.trim() ||
                       document.querySelector('div[id*="job-details"]')?.innerText?.trim() ||
                       document.querySelector('.jobs-search__job-details--container')?.innerText?.trim() ||
                       document.querySelector('article')?.innerText?.trim();

        // Fallback to XPath for "About the job" section if CSS fails
        if (!jdResult) {
            try {
                const xpathResult = document.evaluate("//*[contains(text(), 'About the job')]/ancestor::div[2] | //span[contains(text(), 'About the job')]/ancestor::div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (xpathResult.singleNodeValue) {
                    jdResult = xpathResult.singleNodeValue.innerText.trim();
                }
            } catch (e) {}
        }

        if (!jobTitle || !jdResult) {
            console.log(`[Resume-Sphere Debug]: Skipping because missing -> Title: ${!!jobTitle}, JD: ${!!jdResult}`);
            return null; 
        }

        return { jobTitle, company: company || "Unknown Company", jobDescription: jdResult };
    } catch (err) {
        console.error("Resume-Sphere FATAL Extraction Error:", err);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI Injection
// ... existing functions ...
function injectLoadingBadge() {
    const badge = document.createElement('div');
    badge.id = 'rs-score-badge';
    
    // Inline Styles
    Object.assign(badge.style, {
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: '99999',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(0.9)',
        opacity: '0'
    });

    badge.innerHTML = `
        <span id="rs-badge-icon">⚡</span>
        <span id="rs-badge-text">Scoring...</span>
    `;

    document.body.appendChild(badge);
    
    // Animate in
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
        badge.style.opacity = '1';
    }, 10);

    badge.addEventListener('click', () => {
        // Opening popup via script is restricted, but this encourages user interaction
        badge.style.transform = 'scale(0.95)';
        setTimeout(() => badge.style.transform = 'scale(1)', 100);
    });
}

async function scoreJob(jobData) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'scoreJob', ...jobData }, (response) => {
            resolve(response || { success: false, error: 'Communication error' });
        });
    });
}

function updateBadge(result) {
    const badge = document.getElementById('rs-score-badge');
    if (!badge) return;

    if (result.success === false) {
        badge.style.backgroundColor = '#475569';
        if (result.error === 'AUTH_EXPIRED' || result.error === 'AUTH_REQUIRED') {
            badge.innerHTML = `<span id="rs-badge-icon">🔒</span> <span id="rs-badge-text">Sign In</span>`;
        } else {
            badge.innerHTML = `<span id="rs-badge-icon">⚠</span> <span id="rs-badge-text">Score Failed</span>`;
        }
        return;
    }

    const score = result.score;
    let bgColor = '#dc2626'; // Red
    let icon = '✗';
    
    if (score >= 85) {
        bgColor = '#16a34a'; // Green
        icon = '✓';
    } else if (score >= 70) {
        bgColor = '#d97706'; // Amber
        icon = '◑';
    }

    badge.style.backgroundColor = bgColor;
    badge.innerHTML = `<span id="rs-badge-icon">${icon}</span> <span id="rs-badge-text">${score}% Match</span>`;
    
    // Send status update to popup
    chrome.runtime.sendMessage({
        action: 'updateStatus',
        text: `Scored: ${result.jobTitle} @ ${result.company} — ${score}%`
    }).catch(() => {}); // Ignore if popup not open
}

// ═══════════════════════════════════════════════════════════════════════════════
// Auto-Apply Logic
// ═══════════════════════════════════════════════════════════════════════════════

async function checkAutoApply(result, jobData) {
    const { autoApply, threshold } = await chrome.storage.local.get(['autoApply', 'threshold']);
    if (!autoApply) return;
    if (!result.success) return;
    if (result.score < (threshold || 70)) return;

    // Check Easy Apply button exists
    const easyApplyBtn = findEasyApplyButton();
    if (!easyApplyBtn) {
        await logApplication(jobData, result.score, 'Skipped');
        updateBadgeText('⊘ Skipped', '#64748b');
        return;
    }

    // Show "Applying..." state on badge
    updateBadgeText('⏳ Applying...', '#d97706');

    // Fetch user profile for form filling
    const profileResult = await new Promise(resolve =>
        chrome.runtime.sendMessage({ action: 'getProfile' }, resolve)
    );

    if (!profileResult?.success) {
        updateBadgeText('🔒 Sign In', '#dc2626');
        return;
    }

    // Attempt Easy Apply
    const applyResult = await attemptEasyApply(jobData, profileResult.profile, result.score);

    // Log the application result
    await logApplication(jobData, result.score, applyResult.status);

    // Update badge based on result
    if (applyResult.success) {
        updateBadgeText('✓ Applied!', '#16a34a');
        showAppliedNotification(jobData.company, result.score);
    } else if (applyResult.status === 'Skipped') {
        updateBadgeText('⊘ Skipped', '#64748b');
    } else {
        updateBadgeText('✗ Failed', '#dc2626');
        console.warn('[Resume-Sphere] Apply failed:', applyResult.reason);
        chrome.runtime.sendMessage({
            action: 'updateError',
            text: `Apply failed: ${applyResult.reason}`
        }).catch(() => {});
    }
}

function updateBadgeText(text, bgColor) {
    const badge = document.getElementById('rs-score-badge');
    if (!badge) return;
    const textEl = badge.querySelector('#rs-badge-text');
    if (textEl) textEl.textContent = text;
    badge.style.backgroundColor = bgColor;
}

function showAppliedNotification(company, score) {
    chrome.runtime.sendMessage({
        action: 'showNotification',
        title: 'Application Submitted!',
        message: `${company} — ${score}% match`
    }).catch(() => {});

    const badge = document.getElementById('rs-score-badge');
    if (!badge) return;
    badge.style.transform = 'scale(1.15)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 400);
}

function findEasyApplyButton() {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.innerText.includes('Easy Apply') || b.getAttribute('aria-label')?.includes('Easy Apply'));
}

function updateBadgeAutoApplyReady() {
// ... existing AutoApply logic ...
    const badge = document.getElementById('rs-score-badge');
    if (!badge) return;

    // Add Pulsing ring
    badge.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.4)';
    badge.style.animation = 'pulse 2s infinite';

    const pill = document.createElement('div');
    pill.innerText = 'AUTO-READY';
    Object.assign(pill.style, {
        fontSize: '9px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '2px 6px',
        borderRadius: '10px',
        marginTop: '4px'
    });
    
    badge.style.flexDirection = 'column';
    badge.appendChild(pill);

    // Inject Keyframes for pulse if not exists
    if (!document.getElementById('rs-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'rs-styles';
        styleSheet.innerText = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0px rgba(22, 163, 74, 0.6); }
                70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
                100% { box-shadow: 0 0 0 0px rgba(22, 163, 74, 0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

async function logApplication(jobData, score, status) {
    chrome.runtime.sendMessage({
        action: 'logApplication',
        jobTitle: jobData.jobTitle,
        company: jobData.company,
        linkedInJobUrl: window.location.href,
        matchScore: score,
        status: status
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPA Handling
// ═══════════════════════════════════════════════════════════════════════════════

let lastScoredJob = null;

setInterval(async () => {
    if (!isJobDetailPage()) return;
    
    const jobData = extractJobData();
    if (!jobData) return;
    
    const currentJobKey = jobData.jobTitle + "|" + jobData.company;
    if (currentJobKey !== lastScoredJob) {
        lastScoredJob = currentJobKey;
        
        const oldBadge = document.getElementById('rs-score-badge');
        if (oldBadge) oldBadge.remove();

        injectLoadingBadge();
        const result = await scoreJob(jobData);
        updateBadge(result);
        
        const { autoApply, threshold } = await chrome.storage.local.get(['autoApply', 'threshold']);
        if (autoApply && result.success && result.score >= (threshold || 70)) {
            updateBadgeAutoApplyReady();
        }
        
        checkAutoApply(result, jobData);
    }
}, 1500);
