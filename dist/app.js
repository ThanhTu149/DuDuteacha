const products = [
  { id: "brown-sugar", name: "Sữa Tươi Trân Châu Đường Đen", shortName: "Đường Đen", price: 45000, category: "milk-tea", badge: "Bán chạy", tone: "caramel", color: "#c98545", tilt: "-4deg", description: "Sữa tươi mát, đường đen thơm caramel, trân châu dẻo ấm." },
  { id: "oolong", name: "Oolong Sữa Nướng", shortName: "Oolong Sữa Nướng", price: 42000, category: "milk-tea", badge: "Đậm trà", tone: "cream", color: "#b9794b", tilt: "3deg", description: "Oolong rang thơm, sữa nướng béo nhẹ, hậu vị sạch." },
  { id: "strawberry", name: "Dâu Kem Sữa", shortName: "Dâu Kem Sữa", price: 48000, category: "milk-tea", badge: "Mới", tone: "pink", color: "#ef7d93", tilt: "-2deg", description: "Dâu chua ngọt, sữa tươi và lớp kem mằn mặn vui miệng." },
  { id: "matcha", name: "Matcha Mochi", shortName: "Matcha Mochi", price: 49000, category: "milk-tea", badge: "Thơm béo", tone: "green", color: "#8fb75d", tilt: "4deg", description: "Matcha đậm vị, sữa mượt và mochi mềm dẻo." },
  { id: "peach", name: "Trà Đào Cam Sả", shortName: "Đào Cam Sả", price: 39000, category: "fruit-tea", badge: "Tươi mát", tone: "orange", color: "#efa45f", tilt: "-3deg", description: "Trà thanh, đào giòn, cam tươi và hương sả dịu." },
  { id: "passion", name: "Chanh Dây Nha Đam", shortName: "Chanh Dây Nha Đam", price: 37000, category: "fruit-tea", badge: "Ít ngọt ngon", tone: "berry", color: "#d785aa", tilt: "2deg", description: "Chanh dây chua sáng vị, nha đam giòn mát, uống là tỉnh." }
];

const formatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const menuGrid = document.querySelector("#menu-grid");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const cartTotal = document.querySelector("#cart-total");
const copyStatus = document.querySelector("#copy-status");
const toast = document.querySelector("#toast");
const drawer = document.querySelector(".cart-drawer");
let lastFocused = null;
let cart = JSON.parse(localStorage.getItem("dudu-cart") || "{}");

function renderMenu(filter = "all") {
  const visible = filter === "all" ? products : products.filter((item) => item.category === filter);
  menuGrid.innerHTML = visible.map((item) => `
    <article class="menu-card" data-tone="${item.tone}">
      <span class="menu-card-badge">${item.badge}</span>
      <div class="drink-art" aria-hidden="true">
        <div class="drink-cup" style="--drink:${item.color};--tilt:${item.tilt}"><span class="pearls"></span></div>
      </div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-card-footer">
        <span class="price">${formatter.format(item.price)}</span>
        <button class="add-button" type="button" data-add="${item.id}" aria-label="Thêm ${item.name} vào giỏ">+</button>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("dudu-cart", JSON.stringify(cart));
}

function cartEntries() {
  return Object.entries(cart).map(([id, quantity]) => ({ ...products.find((item) => item.id === id), quantity })).filter((item) => item.id);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((node) => node.textContent = count);
  document.querySelector("[data-open-cart]").setAttribute("aria-label", `Mở giỏ hàng, ${count} món`);
  cartEmpty.hidden = entries.length > 0;
  cartSummary.hidden = entries.length === 0;
  cartTotal.textContent = formatter.format(total);
  cartItems.innerHTML = entries.map((item) => `
    <div class="cart-item">
      <div><strong>${item.shortName}</strong><small>${formatter.format(item.price)}</small></div>
      <div class="cart-item-actions">
        <button class="qty-button" type="button" data-decrease="${item.id}" aria-label="Giảm ${item.shortName}">−</button>
        <span>${item.quantity}</span>
        <button class="qty-button" type="button" data-increase="${item.id}" aria-label="Tăng ${item.shortName}">+</button>
      </div>
    </div>
  `).join("");
  saveCart();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openCart() {
  lastFocused = document.activeElement;
  document.body.classList.add("drawer-open");
  drawer.setAttribute("aria-hidden", "false");
  drawer.querySelector(".icon-button").focus();
}

function closeCart() {
  document.body.classList.remove("drawer-open");
  drawer.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) {
    cart[add.dataset.add] = (cart[add.dataset.add] || 0) + 1;
    renderCart();
    showToast("Đã thêm một ly vào giỏ");
  }
  const increase = event.target.closest("[data-increase]");
  if (increase) { cart[increase.dataset.increase] += 1; renderCart(); }
  const decrease = event.target.closest("[data-decrease]");
  if (decrease) {
    cart[decrease.dataset.decrease] -= 1;
    if (cart[decrease.dataset.decrease] <= 0) delete cart[decrease.dataset.decrease];
    renderCart();
  }
  if (event.target.closest("[data-open-cart]")) openCart();
  if (event.target.closest("[data-close-cart]")) closeCart();
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    renderMenu(button.dataset.filter);
  });
});

document.querySelector("#copy-order").addEventListener("click", async () => {
  const lines = cartEntries().map((item) => `- ${item.quantity} × ${item.name}: ${formatter.format(item.quantity * item.price)}`);
  const order = [`Đơn DuDu`, ...lines, `Tổng: ${cartTotal.textContent}`, `Ghi chú: Vui lòng xác nhận giá và kênh nhận đơn.`].join("\n");
  try {
    await navigator.clipboard.writeText(order);
    copyStatus.textContent = "Đã sao chép — bạn có thể gửi đơn cho DuDu.";
  } catch {
    copyStatus.textContent = "Không thể sao chép tự động. Hãy thử lại trên trình duyệt mới hơn.";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("drawer-open")) closeCart();
});

renderMenu();
renderCart();
