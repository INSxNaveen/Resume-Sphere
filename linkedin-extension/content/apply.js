/**
 * Task 2: content/apply.js
 * Easy Apply Orchestrator with Anti-Bot Safety.
 */

const STEP_DELAY_MS = 1200;       
const FILL_DELAY_MS = 600;       
const MAX_STEPS = 10;            
const MODAL_LOAD_TIMEOUT = 8000; 
const SENSITIVE_PAUSE_MS = 45000;

function delay(ms) {
    const jitter = (Math.random() - 0.5) * 0.4 * ms; // ±20% jitter
    return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

function humanClick(element) {
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.click();
}

async function checkRateLimit() {
    const { applyTimestamps = [] } = await chrome.storage.local.get('applyTimestamps');
    const oneHourAgo = Date.now() - 3600000;
    const recentApplies = applyTimestamps.filter(t => t > oneHourAgo);
    if (recentApplies.length >= 15) {
        return { allowed: false, reason: 'Rate limit: max 15 applications per hour' };
    }
    return { allowed: true, timestamps: recentApplies };
}

async function recordApplyTimestamp() {
    const { applyTimestamps = [] } = await chrome.storage.local.get('applyTimestamps');
    const oneHourAgo = Date.now() - 3600000;
    const recentApplies = applyTimestamps.filter(t => t > oneHourAgo);
    recentApplies.push(Date.now());
    await chrome.storage.local.set({ applyTimestamps: recentApplies });
}

async function attemptEasyApply(jobData, profile, score) {
    const result = {
        success: false,
        status: 'Failed',
        reason: ''
    };

    try {
        const rateLimit = await checkRateLimit();
        if (!rateLimit.allowed) {
            result.status = 'Skipped';
            result.reason = rateLimit.reason;
            console.warn(`[Resume-Sphere] ${rateLimit.reason}`);
            return result;
        }

        const easyApplyBtn = findEasyApplyButton();
        if (!easyApplyBtn) {
            result.status = 'Skipped';
            result.reason = 'No Easy Apply button found';
            return result;
        }

        // Step 1: Hide badge and scroll button into view
        hideBadgeDuringApply();
        easyApplyBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(800);

        humanClick(easyApplyBtn);
        await delay(2000);

        const modal = await waitForModal();
        if (!modal) {
            result.reason = 'Modal did not open';
            return result;
        }

        const walkResult = await walkModalSteps(modal, profile, jobData);
        if (!walkResult.success) {
            result.reason = walkResult.reason;
            return result;
        }

        const submitted = await submitApplication(modal);
        if (!submitted) {
            result.reason = 'Submit button not found or click failed';
            return result;
        }

        const confirmed = await waitForSuccessConfirmation();
        result.success = confirmed;
        result.status = confirmed ? 'Applied' : 'Failed';
        result.reason = confirmed ? 'Application submitted successfully' : 'Success confirmation not detected';

        if (confirmed) {
            await recordApplyTimestamp();
        }
        
        showBadgeAfterApply();

    } catch (err) {
        result.reason = `Unexpected error: ${err.message}`;
        console.error("[Resume-Sphere] Apply error:", err);
        showBadgeAfterApply();
    }

    return result;
}

async function waitForModal() {
    const start = Date.now();
    while (Date.now() - start < MODAL_LOAD_TIMEOUT) {
        const modal = getModalContainer();
        if (modal) return modal;
        await delay(400);
    }
    return null;
}

async function walkModalSteps(modal, profile, jobData) {
    let stepCount = 0;

    while (stepCount < MAX_STEPS) {
        stepCount++;
        await delay(STEP_DELAY_MS);

        const stepType = detectStepType(modal);
        if (stepType === 'review') return { success: true };

        let stepResult;
        if (stepType === 'contact') {
            stepResult = await handleContactStep(modal, profile);
        } else if (stepType === 'resume') {
            stepResult = await handleResumeStep(modal);
        } else if (stepType === 'questions') {
            stepResult = await handleQuestionsStep(modal, profile);
        } else {
            stepResult = { success: true }; 
        }

        if (!stepResult.success) {
            return { success: false, reason: stepResult.reason };
        }

        const nextBtn = getNextButton(modal);
        if (!nextBtn) {
            if (getSubmitButton(modal)) return { success: true };
            return { success: false, reason: `No Next button found on step ${stepCount}` };
        }

        humanClick(nextBtn);
        await delay(STEP_DELAY_MS);
    }

    return { success: false, reason: `Exceeded max steps (${MAX_STEPS})` };
}

async function handleContactStep(modal, profile) {
    try {
        const firstNameInput = modal.querySelector('input[id*="first"], input[name*="first"], input[id*="firstName"]');
        if (firstNameInput && !firstNameInput.value) {
            fillInputField(firstNameInput, profile.fullName.split(' ')[0] || '');
            await delay(FILL_DELAY_MS);
        }

        const lastNameInput = modal.querySelector('input[id*="last"], input[name*="last"], input[id*="lastName"]');
        if (lastNameInput && !lastNameInput.value) {
            const parts = profile.fullName.split(' ');
            fillInputField(lastNameInput, parts.slice(1).join(' ') || '');
            await delay(FILL_DELAY_MS);
        }

        const emailInput = modal.querySelector('input[type="email"], input[id*="email"]');
        if (emailInput && !emailInput.value) {
            fillInputField(emailInput, profile.email || '');
            await delay(FILL_DELAY_MS);
        }

        const phoneInput = modal.querySelector('input[type="tel"], input[id*="phone"], input[id*="mobile"]');
        if (phoneInput && !phoneInput.value) {
            fillInputField(phoneInput, profile.phone || '');
            await delay(FILL_DELAY_MS);
        }

        return { success: true };
    } catch (err) {
        return { success: false, reason: `Contact step error: ${err.message}` };
    }
}

async function handleResumeStep(modal) {
    try {
        const selectedResume = modal.querySelector('.jobs-resume-picker__resume--selected, [aria-selected="true"], input[type="radio"]:checked');
        if (selectedResume) return { success: true };

        const firstResumeOption = modal.querySelector('.jobs-resume-picker__resume, input[type="radio"][name*="resume"]');
        if (firstResumeOption) {
            humanClick(firstResumeOption);
            await delay(FILL_DELAY_MS);
            return { success: true };
        }

        return { success: true };
    } catch (err) {
        return { success: false, reason: `Resume step error: ${err.message}` };
    }
}

async function handleQuestionsStep(modal, profile) {
    try {
        const fields = getAllQuestionFields(modal);
        let sensitiveFound = false;

        for (const field of fields) {
            const { labelText, inputType, inputEl, options, element } = field;
            const isRequired = isRequiredField(element);

            if (isSensitiveQuestion(labelText)) {
                sensitiveFound = true;
                highlightFieldForManualInput(element, labelText);
                continue;
            }

            const aiAnswer = await getAIAnswer(profile.resumeText, labelText, inputType, options);
            if (!aiAnswer || aiAnswer.confidence === 0.0) {
                if (isRequired) highlightFieldForManualInput(element, labelText);
                continue;
            }

            if (!isRequired && aiAnswer.confidence < 0.5) continue;

            await fillField(field, aiAnswer.answer);
            await delay(FILL_DELAY_MS);
        }

        if (sensitiveFound) {
            showSensitiveQuestionNotification();
            await delay(SENSITIVE_PAUSE_MS);
            hideSensitiveQuestionNotification();
        }

        return { success: true };
    } catch (err) {
        return { success: false, reason: `Questions step error: ${err.message}` };
    }
}

async function getAIAnswer(resumeText, question, questionType, options) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            action: 'screenAnswer',
            resumeText,
            question,
            questionType,
            options: options ? options.map(o => o.value) : null
        }, (response) => {
            // Bug 4.A fix: Handle undefined response/runtime error
            if (!response || chrome.runtime.lastError) {
                console.warn('[Resume-Sphere] Screen answer timed out or failed, skipping field');
                resolve(null);
                return;
            }
            if (response.success) {
                resolve({ answer: response.answer, confidence: response.confidence });
            } else {
                resolve(null);
            }
        });
    });
}

async function fillField(field, answer) {
    const { inputType, inputEl, options } = field;
    const lowerAnswer = answer.toLowerCase().trim();

    try {
        if (inputType === 'yes_no' || inputType === 'multiple_choice') {
            if (inputEl.tagName === 'SELECT') {
                selectDropdownOption(inputEl, answer);
            } else {
                for (const opt of options) {
                    if (opt.value.toLowerCase().includes(lowerAnswer)) {
                        humanClick(opt.el);
                        break;
                    }
                }
            }
        } else {
            fillInputField(inputEl, answer);
        }
    } catch (err) {
        console.warn(`[Resume-Sphere] Failed to fill field: ${err.message}`);
    }
}

async function submitApplication(modal) {
    await delay(STEP_DELAY_MS);
    const submitBtn = getSubmitButton(modal);
    if (!submitBtn) return false;
    humanClick(submitBtn);
    return true;
}

async function waitForSuccessConfirmation() {
    const successIndicators = [
        '[data-test-job-success-modal]',
        '.jobs-post-apply-modal',
        '[aria-label*="applied"]',
        'h2[class*="success"]'
    ];

    const start = Date.now();
    while (Date.now() - start < 8000) {
        for (const sel of successIndicators) {
            if (document.querySelector(sel)) return true;
        }
        if (!getModalContainer()) return true;
        await delay(500);
    }
    return false;
}

function showSensitiveQuestionNotification() {
    const banner = document.createElement('div');
    banner.id = 'rs-sensitive-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        font-weight: 600;
        z-index: 999999;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    `;
    banner.textContent = '⚠ Resume-Sphere: Sensitive question detected — please fill it manually. Auto-apply will resume in 45 seconds.';
    document.body.prepend(banner);
}

function hideSensitiveQuestionNotification() {
    document.getElementById('rs-sensitive-banner')?.remove();
}

function highlightFieldForManualInput(element, labelText) {
    element.style.outline = '2px solid #dc2626';
    element.style.borderRadius = '4px';
    const hint = document.createElement('div');
    hint.style.cssText = 'color: #dc2626; font-size: 11px; margin-top: 4px; font-weight: 600;';
    hint.textContent = '⚠ Resume-Sphere: Please fill this manually';
    element.appendChild(hint);
}

function hideBadgeDuringApply() {
    const badge = document.getElementById('rs-score-badge');
    if (badge) badge.style.display = 'none';
}

function showBadgeAfterApply() {
    const badge = document.getElementById('rs-score-badge');
    if (badge) badge.style.display = 'flex';
}

function findEasyApplyButton() {
    const selectors = [
        'button[aria-label*="Easy Apply"]',
        '.jobs-apply-button--top-card button',
        'button[class*="jobs-apply-button"]'
    ];
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    return null;
}
