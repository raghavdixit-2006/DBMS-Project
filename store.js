const productGrid = document.getElementById("product-grid");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:3001/api/products");
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error(err);
    productGrid.innerHTML = "<p class='text-red-600'>Failed to load products.</p>";
  }
}

function renderProducts(list) {
  productGrid.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-lg shadow-md flex flex-col";

    card.innerHTML = `
      <img src="${product.img_url}" alt="${product.name}" class="w-full h-56 object-cover rounded-t-lg">
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="font-bold text-lg mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-2">₹${product.price}</p>

        <select class="mb-2 border rounded p-1 size-select">
          ${product.sizes.map(size => `<option>${size}</option>`).join('')}
        </select>

        <button 
          class="mt-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 rounded btn" 
          data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const size = e.target.previousElementSibling.value;
      addToCart(id, size);
    });
  });
}

function addToCart(id, size) {
  const product = products.find(p => p.id == id);
  const item = { ...product, qty: 1, size };
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
  updateCartCount();
}

// Auto-apply filters when selection changes
document.getElementById("filter-gender").addEventListener("change", applyFilters);
document.getElementById("filter-occasion").addEventListener("change", applyFilters);

function applyFilters() {
  const gender = document.getElementById("filter-gender").value;
  const occasion = document.getElementById("filter-occasion").value;

  let filtered = products;
  if (gender) filtered = filtered.filter(p => p.gender === gender);
  if (occasion) filtered = filtered.filter(p => p.occasion === occasion);

  renderProducts(filtered);
}

fetchProducts();
