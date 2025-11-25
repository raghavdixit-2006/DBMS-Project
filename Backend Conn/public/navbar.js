function loadNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("navbar").innerHTML = `
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <a href="index.html" class="text-2xl font-bold text-blue-700">Stellar Soles</a>
      <ul class="flex items-center gap-6 text-gray-700 font-medium">
        <li><a href="index.html" class="hover:text-blue-700">Home</a></li>
        <li><a href="store.html" class="hover:text-blue-700">Store</a></li>
        <li><a href="about.html" class="hover:text-blue-700">About</a></li>
        <li><a href="contact.html" class="hover:text-blue-700">Contact Us</a></li>
        <li><a href="checkout.html" class="hover:text-blue-700">🛒 Cart</a></li>

        ${
          user
            ? `
          <li class="relative">
            <button id="profileBtn" class="flex items-center gap-2 hover:text-blue-700 focus:outline-none">
              👤 ${user.name.split(" ")[0]}
            </button>
            <div id="profileMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg hidden">
              <a href="profile.html" class="block px-4 py-2 hover:bg-gray-100">My Profile</a>
              <a href="#" id="logoutBtn" class="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</a>
            </div>
          </li>`
            : `
          <li class="relative">
            <button id="accountBtn" class="hover:text-blue-700 focus:outline-none">👤 Account</button>
            <div id="accountMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg hidden">
              <a href="login.html" class="block px-4 py-2 hover:bg-gray-100">Login</a>
              <a href="signup.html" class="block px-4 py-2 hover:bg-gray-100">Sign Up</a>
            </div>
          </li>`
        }
      </ul>
    </div>
  </nav>
  `;

  // Toggle menus
  const accountBtn = document.getElementById("accountBtn");
  const accountMenu = document.getElementById("accountMenu");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (accountBtn && accountMenu)
    accountBtn.addEventListener("click", () => accountMenu.classList.toggle("hidden"));
  if (profileBtn && profileMenu)
    profileBtn.addEventListener("click", () => profileMenu.classList.toggle("hidden"));

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#accountBtn") && !e.target.closest("#accountMenu"))
      accountMenu?.classList.add("hidden");
    if (!e.target.closest("#profileBtn") && !e.target.closest("#profileMenu"))
      profileMenu?.classList.add("hidden");
  });

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
window.addEventListener("userLoggedIn", loadNavbar);
