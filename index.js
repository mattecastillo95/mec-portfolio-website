const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');
const contactForm = document.querySelector('#contact-form');
const contactSubmit = document.querySelector('#contact-submit');
const formStatus = document.querySelector('#form-status');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeIcon) themeIcon.textContent = isDark ? '☼' : '◐';
  if (themeLabel) themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  const logo = document.querySelector('.brand img');
  if (logo) logo.src = isDark ? './assets/mc-monogram-white-red.svg' : './assets/mc-monogram.svg';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#101010' : '#f7f5f2');
}

const savedTheme = localStorage.getItem('mc-theme');
const preferredDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (preferredDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('mc-theme', nextTheme);
});

document.querySelector('#year').textContent = new Date().getFullYear();

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!window.emailjs) {
    formStatus.textContent = 'The message service is unavailable right now. Please email me directly.';
    formStatus.className = 'form-status is-error';
    return;
  }

  contactSubmit.disabled = true;
  contactSubmit.innerHTML = 'Sending… <span aria-hidden="true">↗</span>';
  formStatus.textContent = 'Sending your message…';
  formStatus.className = 'form-status';

  try {
    await emailjs.sendForm('service_vwhpitf', 'template_5s5s1sy', contactForm, 'Dn5p2yQQm0zeCxcGd');
    formStatus.textContent = 'Thanks — your message has been sent. I look forward to speaking with you!';
    formStatus.className = 'form-status is-success';
    contactForm.reset();
  } catch (error) {
    console.error('EmailJS error:', error);
    formStatus.textContent = 'Sorry, your message could not be sent. Please email mattecastillo95@gmail.com instead.';
    formStatus.className = 'form-status is-error';
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
  }
});
