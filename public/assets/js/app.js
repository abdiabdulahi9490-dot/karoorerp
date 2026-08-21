// public/assets/js/app.js - minimal client logic

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const password = form.password.value;
      const msg = document.getElementById('message');
      try {
        const data = await postJSON('/api/auth/login', { email, password });
        if (data && data.id) {
          window.location.href = '/';
        } else {
          msg.textContent = data.message || 'Login failed';
        }
      } catch (err) {
        msg.textContent = 'Network error';
      }
    });
  }
});
