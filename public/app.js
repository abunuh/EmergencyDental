/* ===========================
   App JavaScript
   =========================== */

// ---- Dynamic year in footer ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close mobile nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ---- Sticky header shadow ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.3)' : '';
}, { passive: true });

// ---- Set min date to today on date picker ----
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ---- Appointment form submission ----
const form = document.getElementById('appointmentForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const formErrorText = document.getElementById('formErrorText');

function showMessage(el, show) {
  el.hidden = !show;
  if (show) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.querySelector('span').textContent = loading ? 'Sending…' : 'Request Appointment';
  const icon = submitBtn.querySelector('i');
  icon.className = loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-calendar-check';
}

function validateForm(data) {
  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

  const name = form.querySelector('#name');
  const phone = form.querySelector('#phone');
  const service = form.querySelector('#service');

  if (!data.get('name') || data.get('name').trim().length < 2) {
    name.classList.add('error');
    name.focus();
    valid = false;
  }
  if (!data.get('phone') || data.get('phone').trim().length < 7) {
    phone.classList.add('error');
    if (valid) phone.focus();
    valid = false;
  }
  if (!data.get('service')) {
    service.classList.add('error');
    if (valid) service.focus();
    valid = false;
  }
  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  if (!validateForm(data)) return;

  setLoading(true);
  showMessage(formSuccess, false);
  showMessage(formError, false);

  const body = Object.fromEntries(data.entries());

  try {
    const response = await fetch('/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (result.success) {
      form.hidden = true;
      showMessage(formSuccess, true);
    } else {
      formErrorText.innerHTML = (result.message || 'Please try again or call us at')
        + ' <a href="tel:5013131616">501-313-1616</a>.';
      showMessage(formError, true);
    }
  } catch {
    formErrorText.innerHTML = 'Network error. Please try again or call us at <a href="tel:5013131616">501-313-1616</a>.';
    showMessage(formError, true);
  } finally {
    setLoading(false);
  }
});

// ---- Animate elements into view ----
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .why-list li, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

// Add visible class to trigger animation
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
