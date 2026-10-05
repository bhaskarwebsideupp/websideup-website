/**
 * WEBSIDEUP — MULTI-STEP PROJECT BRIEF CONTROLLER
 */
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const progressBar = document.getElementById('formProgress');

  if (!form) return;

  // State
  let currentStep = 1;
  const formData = {};

  function getStepEl(n) {
    return form.querySelector('[data-step="' + n + '"]');
  }

  function updateProgress(n) {
    if (!progressBar) return;
    const dots = progressBar.querySelectorAll('.progress-step');
    dots.forEach(function (dot, i) {
      if (i < n) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    progressBar.setAttribute('aria-valuenow', n);
  }

  function goTo(targetStep) {
    const current = getStepEl(currentStep);
    const target = getStepEl(targetStep);
    if (!current || !target) return;

    current.classList.remove('active');
    target.classList.add('active');
    currentStep = targetStep;
    updateProgress(currentStep);

    // Focus first interactive element in new step
    const firstInput = target.querySelector('input, textarea, button:not(.btn-form-back)');
    if (firstInput) {
      requestAnimationFrame(function () { firstInput.focus(); });
    }
  }

  function validateStep(n) {
    const step = getStepEl(n);
    if (!step) return true;

    const inputs = step.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    inputs.forEach(function (input) {
      if (!input.value.trim() || !input.checkValidity()) {
        input.reportValidity();
        valid = false;
      }
    });

    return valid;
  }

  // Service option toggles
  const optionBtns = form.querySelectorAll('.field-option-btn');
  optionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.classList.toggle('selected');
    });
  });

  // Next buttons
  form.querySelectorAll('.btn-form-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const next = parseInt(this.getAttribute('data-next'), 10);
      if (validateStep(currentStep)) {
        goTo(next);
      }
    });
  });

  // Back buttons
  form.querySelectorAll('.btn-form-back').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const prev = parseInt(this.getAttribute('data-prev'), 10);
      goTo(prev);
    });
  });

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    // Collect data
    formData.services = Array.from(form.querySelectorAll('.field-option-btn.selected'))
                             .map(function (b) { return b.getAttribute('data-value'); }).join(', ');
    formData.name = (form.querySelector('#fieldName') || {}).value || '';
    formData.email = (form.querySelector('#fieldEmail') || {}).value || '';
    formData.phone = (form.querySelector('#fieldPhone') || {}).value || '';
    formData.company = (form.querySelector('#fieldCompany') || {}).value || '';
    formData.message = (form.querySelector('#fieldMessage') || {}).value || '';

    console.log('Project Brief Submitted:', formData);

    form.style.display = 'none';
    if (progressBar) progressBar.style.display = 'none';
    if (successEl) {
      successEl.classList.add('active');
      successEl.focus();
    }

    if (navigator.maxTouchPoints > 0 && 'vibrate' in navigator) {
      try { navigator.vibrate(10); } catch (_) {}
    }
  });

})();
