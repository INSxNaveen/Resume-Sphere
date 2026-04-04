/**
 * Task 1: content/formDetectors.js
 * Pure utility functions for reading LinkedIn Modal DOM.
 * Loaded into global scope for apply.js and content.js.
 */

function getModalContainer() {
  const selectors = [
    '.jobs-easy-apply-modal',
    '[data-test-modal]',
    '.artdeco-modal',
    '[role="dialog"]'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}

function getModalTitle(modal) {
  const selectors = [
    'h3.jobs-easy-apply-form-section__grouping-title',
    'h3[class*="easy-apply"]',
    '.artdeco-modal h3',
    '[data-test-modal-header]',
    'h3'
  ];
  for (const sel of selectors) {
    const el = modal.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim().toLowerCase();
  }
  return '';
}

function getNextButton(modal) {
  const selectors = [
    'button[aria-label="Continue to next step"]',
    'button[aria-label="Review your application"]',
    'button[data-easy-apply-next-button]',
    'footer button.artdeco-button--primary'
  ];
  for (const sel of selectors) {
    const el = modal.querySelector(sel);
    if (el && !el.disabled) return el;
  }
  
  const footerBtns = modal.querySelectorAll('footer button.artdeco-button--primary');
  for (const btn of footerBtns) {
    const label = btn.textContent?.trim().toLowerCase();
    if (label && label !== 'submit application' && label !== 'done') return btn;
  }
  return null;
}

function getSubmitButton(modal) {
  const selectors = [
    'button[aria-label="Submit application"]',
    'button[data-easy-apply-submit]'
  ];
  for (const sel of selectors) {
    const el = modal.querySelector(sel);
    if (el && !el.disabled) return el;
  }
  
  const btns = modal.querySelectorAll('button.artdeco-button--primary');
  for (const btn of btns) {
    if (btn.textContent?.trim().toLowerCase() === 'submit application') return btn;
  }
  return null;
}

function getCloseButton(modal) {
  return (
    modal.querySelector('button[aria-label="Dismiss"]') ||
    modal.querySelector('button[aria-label="Close"]') ||
    modal.querySelector('.artdeco-modal__dismiss')
  );
}

function detectStepType(modal) {
  if (getSubmitButton(modal)) return 'review';

  const title = getModalTitle(modal);
  if (title.includes('contact') || title.includes('personal')) return 'contact';
  if (title.includes('resume') || title.includes('cv')) return 'resume';
  if (title.includes('question') || title.includes('additional') || title.includes('screening')) return 'questions';

  const inputs = modal.querySelectorAll('input, textarea, select');
  if (!inputs.length) return 'unknown';

  const hasContactFields = modal.querySelector('input[id*="name"], input[id*="email"], input[id*="phone"]');
  if (hasContactFields) return 'contact';

  const hasFileUpload = modal.querySelector('input[type="file"]');
  if (hasFileUpload) return 'resume';

  return 'questions';
}

function getAllQuestionFields(modal) {
  const fields = [];
  const formGroups = modal.querySelectorAll(
    '.jobs-easy-apply-form-element, .fb-form-element, [class*="form-element"]'
  );

  for (const group of formGroups) {
    const labelEl = group.querySelector('label, legend, span[class*="label"]');
    const labelText = labelEl?.textContent?.trim() || '';
    if (!labelText) continue;

    const radioInputs = group.querySelectorAll('input[type="radio"]');
    const checkboxInputs = group.querySelectorAll('input[type="checkbox"]');
    const selectEl = group.querySelector('select');
    const textareaEl = group.querySelector('textarea');
    const numberEl = group.querySelector('input[type="number"]');
    const textEl = group.querySelector('input[type="text"]');

    if (radioInputs.length === 2) {
      const opts = Array.from(radioInputs).map(r => ({
        el: r,
        value: r.value || r.nextSibling?.textContent?.trim() || ''
      }));
      fields.push({ element: group, labelText, inputType: 'yes_no', options: opts, inputEl: radioInputs[0] });
    } else if (radioInputs.length > 2) {
      const opts = Array.from(radioInputs).map(r => ({
        el: r,
        value: r.value || r.nextSibling?.textContent?.trim() || ''
      }));
      fields.push({ element: group, labelText, inputType: 'multiple_choice', options: opts, inputEl: radioInputs[0] });
    } else if (selectEl) {
      const opts = Array.from(selectEl.options).map(o => ({ el: o, value: o.text }));
      fields.push({ element: group, labelText, inputType: 'multiple_choice', options: opts, inputEl: selectEl });
    } else if (numberEl) {
      fields.push({ element: group, labelText, inputType: 'numeric', options: null, inputEl: numberEl });
    } else if (textareaEl) {
      fields.push({ element: group, labelText, inputType: 'text', options: null, inputEl: textareaEl });
    } else if (textEl) {
      fields.push({ element: group, labelText, inputType: 'text', options: null, inputEl: textEl });
    }
  }

  return fields;
}

function isSensitiveQuestion(labelText) {
  const sensitiveKeywords = [
    'authorized', 'authorization', 'citizenship', 'visa', 'sponsorship',
    'disability', 'veteran', 'gender', 'race', 'ethnicity',
    'religion', 'age', 'sexual', 'orientation', 'national origin'
  ];
  const lower = labelText.toLowerCase();
  return sensitiveKeywords.some(kw => lower.includes(kw));
}

function isRequiredField(fieldElement) {
  const label = fieldElement.querySelector('label, legend');
  if (label?.textContent?.includes('*')) return true;
  const inputs = fieldElement.querySelectorAll('input, textarea, select');
  for (const input of inputs) {
    if (input.getAttribute('aria-required') === 'true' || input.required) return true;
  }
  return false;
}

function fillInputField(inputEl, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    inputEl.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype,
    'value'
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(inputEl, value);
  } else {
    inputEl.value = value;
  }

  // Bug 4.D fix: Dispatch all essential events for internal React state sync
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  inputEl.dispatchEvent(new Event('change', { bubbles: true }));
  inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
  inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  inputEl.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
}

function selectDropdownOption(selectEl, value) {
  const lowerValue = value.toLowerCase();
  for (const option of selectEl.options) {
    if (option.text.toLowerCase().includes(lowerValue)) {
      selectEl.value = option.value;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}
