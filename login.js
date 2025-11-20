document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // 🧩 Client-side validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email.value.trim())) {
      alert("❌ Please enter a valid email address.");
      email.focus();
      return;
    }

    if (!passwordRegex.test(password.value.trim())) {
      alert("❌ Password must be at least 8 characters long and contain both letters and numbers.");
      password.focus();
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value.trim(),
        }),
      });

      if (res.status === 401) {
        alert("⚠️ Invalid email or password. Please try again.");
        return;
      }

      if (!res.ok) {
        throw new Error('Login failed');
      }
      
      const data = await res.json();
      const user = data.user;

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userLoggedIn"));
      alert(`✅ Welcome back, ${user.name}!`);
      window.location.href = "index.html";

    } catch (err) {
      console.error(err);
      alert("⚠️ An error occurred during login. Please try again later.");
    }
  });
});
