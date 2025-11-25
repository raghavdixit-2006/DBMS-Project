document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  if (!orderId) {
    alert("No order selected for exchange.");
    window.location.href = "profile.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("orderId").value = orderId;

  const form = document.getElementById("exchangeForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const itemName = document.getElementById("itemName").value.trim();
    const reason = document.getElementById("reason").value.trim();

    if (!itemName || !reason) {
      alert("Please fill all fields.");
      return;
    }

    const exchangeRequest = {
      id: "EX" + Date.now(),
      orderId: orderId,
      userId: user.id,
      itemName: itemName,
      reason: reason,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:3000/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exchangeRequest)
      });

      if (!res.ok) throw new Error("Failed to submit exchange request.");

      // Show success and redirect
      document.getElementById("exchange-status").classList.remove("hidden");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Could not submit exchange request. Check server connection.");
    }
  });
});
