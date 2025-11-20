document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;

  const orderHistoryContainer = document.getElementById("orderHistory");

  // Fetch orders from the new backend
  try {
    const res = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
    if (!res.ok) throw new Error('Failed to load orders.');
    
    const userOrders = await res.json();

    if (userOrders.length === 0) {
      orderHistoryContainer.innerHTML = "<p class='text-gray-600'>You have no orders yet.</p>";
    } else {
      userOrders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.className = "border p-3 rounded bg-gray-50 mb-4";

        orderDiv.innerHTML = `
          <p><strong>Order #${order.id}</strong> - <span class="text-sm text-gray-600">${new Date(order.order_date).toLocaleDateString()}</span></p>
          <p class="font-bold">Total: ₹${order.total_amount}</p>
          <ul class="list-disc pl-5 mt-2">
            ${order.items.map(item => `<li>${item.name} - Size: ${item.size} - Qty: ${item.quantity}</li>`).join("")}
          </ul>
          <button class="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 exchange-btn" data-orderid="${order.id}">
            Request Exchange
          </button>
        `;
        orderHistoryContainer.appendChild(orderDiv);
      });

      // Add click listeners to exchange buttons
      document.querySelectorAll(".exchange-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const orderId = btn.dataset.orderid;
          window.location.href = `exchange.html?orderId=${orderId}`;
        });
      });
    }
  } catch (err) {
    console.error("Failed to load orders:", err);
    orderHistoryContainer.innerHTML = "<p class='text-red-600'>Could not load order history.</p>";
  }

  // Fetch exchange requests from the new backend (Anticipating future endpoint)
  try {
    const resEx = await fetch(`http://localhost:3001/api/exchanges/user/${user.id}`);
    if (!resEx.ok) throw new Error('Failed to load exchanges.');

    const userExchanges = await resEx.json();
    
    if (userExchanges.length > 0) {
      const exchangeTitle = document.createElement("h3");
      exchangeTitle.className = "text-xl font-semibold mt-8 mb-4";
      exchangeTitle.textContent = "Your Exchange Requests";
      orderHistoryContainer.appendChild(exchangeTitle);

      userExchanges.forEach(ex => {
        const exDiv = document.createElement("div");
        exDiv.className = "border p-3 rounded bg-gray-100 mt-2";
        exDiv.innerHTML = `
          <p><strong>Exchange ID:</strong> ${ex.id}</p>
          <p><strong>Order ID:</strong> ${ex.order_id}</p>
          <p><strong>Reason:</strong> ${ex.reason}</p>
          <p><strong>Status:</strong> <span class="font-semibold">${ex.status}</span></p>
          <p class="text-sm text-gray-500">Requested on: ${new Date(ex.requested_at).toLocaleDateString()}</p>
        `;
        orderHistoryContainer.appendChild(exDiv);
      });
    }
  } catch (err) {
    console.error("Failed to load exchanges:", err);
    // Silently fail for now, as the endpoint doesn't exist yet.
    // In a real app, you might want to show a non-intrusive error.
  }
});
