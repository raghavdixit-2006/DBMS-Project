// tabs & forms
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});
registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
});

// API base
const API = '/api/auth'; // same origin

// helper to show message
function showMsg(el, text, color = '#ffb86b') {
  el.style.color = color;
  el.textContent = text;
}

// disable / enable form buttons
function setFormDisabled(form, disabled = true) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  btn.disabled = disabled;
  btn.style.opacity = disabled ? 0.7 : 1;
  btn.textContent = disabled
    ? 'Please wait...'
    : form === registerForm
    ? 'Register'
    : 'Login';
}

// --- Register handler ---
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('regMsg');
  msg.textContent = '';

  // Basic client-side validation
  if (!name || !email || !password) {
    showMsg(msg, 'Please fill all fields.');
    return;
  }

  setFormDisabled(registerForm, true);
  try {
    const res = await fetch(API + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showMsg(msg, data.message || 'Registered successfully!', '#7efea3');
      registerForm.reset();
      // switch to login after a moment
      setTimeout(() => {
        document.getElementById('loginTab').click();
      }, 900);
    } else {
      // prefer server error message if provided
      showMsg(msg, data.error || 'Error registering. Try again.');
    }
  } catch (err) {
    console.error('Register error:', err);
    showMsg(msg, 'Network or server error. Try again.');
  } finally {
    setFormDisabled(registerForm, false);
  }
});

// --- Login handler ---
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');
  msg.textContent = '';

  if (!email || !password) {
    showMsg(msg, 'Please enter email and password.');
    return;
  }

  setFormDisabled(loginForm, true);
  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showMsg(msg, data.message || 'Login successful!', '#7efea3');
      loginForm.reset();

      // ✅ Save user info locally for dashboard
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redirect to dashboard.html
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 500);
    } else {
      showMsg(msg, data.error || 'Invalid credentials.');
    }
  } catch (err) {
    console.error('Login error:', err);
    showMsg(msg, 'Network or server error. Try again.');
  } finally {
    setFormDisabled(loginForm, false);
  }
});
