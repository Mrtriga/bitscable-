document.addEventListener('DOMContentLoaded', function () {const formLoadTime = Date.now();
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!form) return;

  const urlPattern = /^https?:\/\/.+\..+/i;

  function clearErrors() {
    form.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error');
      const err = g.querySelector('.form-error');
      if (err) err.remove();
    });
  }

  function showError(field, message) {
    const group = field.closest('.form-group');
    group.classList.add('has-error');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = message;
    group.appendChild(err);
    return group;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const name = form.querySelector('#contact-name');
    const email = form.querySelector('#contact-email');
    const website = form.querySelector('#contact-website');
    const budget = form.querySelector('#contact-budget');
    const goals = form.querySelector('#contact-goals');

    let firstInvalid = null;

    if (!name.value.trim()) firstInvalid = firstInvalid || showError(name, 'Please enter your name.');
    if (!email.value.trim() || !email.checkValidity()) firstInvalid = firstInvalid || showError(email, 'Please enter a valid email.');
    if (website.value.trim() && !urlPattern.test(website.value.trim())) firstInvalid = firstInvalid || showError(website, 'Enter a full URL, e.g. https://yoursite.com');
    if (!budget.value) firstInvalid = firstInvalid || showError(budget, 'Please select a budget range.');
    if (!goals.value.trim()) firstInvalid = firstInvalid || showError(goals, 'Please tell us about your project.');

    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = firstInvalid.querySelector('input, select, textarea');
      if (input) input.focus();
      return;
    }

    const submitBtn = form.querySelector('.contact-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          statusEl.textContent = "Thanks — your message is in. We'll reply within 24 hours.";
          statusEl.classList.add('form-status--success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(() => {
        statusEl.textContent = "Something went wrong. Please try again, or email info@bitscable.com directly.";
        statusEl.classList.add('form-status--error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry & Get Free Audit';
      });
  });
});