let cart = JSON.parse(localStorage.getItem("cart")) || [];
const table = document.getElementById("checkout-table");

function renderCart() {
  table.innerHTML = "";
  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "border-b";
    row.innerHTML = `
      <td class="py-2 px-4 text-center"><input type="checkbox" class="select-item" checked></td>
      <td class="py-2 px-4 flex items-center gap-3"><img src="${item.img}" class="w-12 h-12 object-cover">${item.name}</td>
      <td class="py-2 px-4"><input type="text" value="${item.size}" class="border p-1 rounded size-input"></td>
      <td class="py-2 px-4"><input type="number" min="1" value="${item.qty}" class="border p-1 rounded qty-input"></td>
      <td class="py-2 px-4 font-semibold">₹${item.price}</td>
      <td class="py-2 px-4 text-center"><button class="remove-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">X</button></td>
    `;
    table.appendChild(row);

    row.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(index,1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });

    row.querySelector(".qty-input").addEventListener("change", e => {
      item.qty = parseInt(e.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));
    });

    row.querySelector(".size-input").addEventListener("change", e => {
      item.size = e.target.value;
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".select-item");
  const selectedItems = cart.filter((_, i) => checkboxes[i].checked);
  if(selectedItems.length===0){ alert("Select at least one item"); return; }

  // Only send selected items to payment page
  localStorage.setItem("paymentCart", JSON.stringify(selectedItems));

  // Keep them in main cart until payment succeeds
  window.location.href = "payment.html";
});

renderCart();
