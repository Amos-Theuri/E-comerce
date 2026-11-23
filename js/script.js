// ==========================================================================
// 1. NAVIGATION DRAWER
// ==========================================================================
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar && nav) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close && nav) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// Close drawer when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (
    nav &&
    nav.classList.contains("active") &&
    !nav.contains(e.target) &&
    bar &&
    !bar.contains(e.target)
  ) {
    nav.classList.remove("active");
  }
});

// ==========================================================================
// 2. THEME MANAGEMENT (DARK / LIGHT MODE)
// ==========================================================================
const THEME_STORAGE_KEY = "storefront_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    return saved;
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", theme);

  if (document.body) {
    document.body.classList.toggle("dark-mode", isDark);
  }

  // Update all toggle icons (desktop & mobile)
  const toggles = document.querySelectorAll(".theme-toggle, #darkmode");
  toggles.forEach((el) => {
    if (isDark) {
      el.classList.remove("ri-moon-line", "ri-contrast-2-fill");
      el.classList.add("ri-sun-line");
      el.setAttribute("title", "Switch to light mode");
      el.setAttribute("aria-label", "Switch to light mode");
    } else {
      el.classList.remove("ri-sun-line", "ri-contrast-2-fill");
      el.classList.add("ri-moon-line");
      el.setAttribute("title", "Switch to dark mode");
      el.setAttribute("aria-label", "Switch to dark mode");
    }
  });
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") ||
    (document.body && document.body.classList.contains("dark-mode") ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

// Global backward compatibility
window.myFunction = toggleTheme;

function initTheme() {
  applyTheme(getPreferredTheme());

  const toggles = document.querySelectorAll(".theme-toggle, #darkmode");
  toggles.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });
}

// Listen for system theme changes if user has not explicitly chosen
if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

// ==========================================================================
// 3. CART SYSTEM & LOCALSTORAGE
// ==========================================================================
const CART_STORAGE_KEY = "storefront_cart";
const COUPON_STORAGE_KEY = "storefront_coupon";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse cart from localStorage:", err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
}

function getActiveCoupon() {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function parsePrice(priceStr) {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  const match = String(priceStr).match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function normalizeAssetPath(src) {
  if (!src) return "assets/products/f1.jpg";
  const idx = src.indexOf("assets/");
  if (idx !== -1) {
    return src.substring(idx);
  }
  return src.replace(/^\.\.\//, "");
}

function getDisplayAssetPath(normalizedPath) {
  if (!normalizedPath) return "";
  if (normalizedPath.startsWith("http") || normalizedPath.startsWith("data:")) {
    return normalizedPath;
  }
  const isInPagesDir = window.location.pathname.includes("/pages/");
  return isInPagesDir ? "../" + normalizedPath : normalizedPath;
}

function getCartPageLink() {
  const isInPagesDir = window.location.pathname.includes("/pages/");
  return isInPagesDir ? "cart.html" : "pages/cart.html";
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
}

function updateCartBadges() {
  const count = getCartCount();
  const cartLinks = document.querySelectorAll('#lg-bag a, #mobile a[href*="cart.html"]');

  cartLinks.forEach((link) => {
    let badge = link.querySelector(".cart-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-badge";
      link.appendChild(badge);
    }

    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
      badge.classList.add("pop");
      setTimeout(() => badge.classList.remove("pop"), 300);
    } else {
      badge.classList.add("hidden");
    }
  });
}

function showToast(message, actionText, actionUrl) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  let html = `<i class="ri-checkbox-circle-fill"></i><span>${message}</span>`;
  if (actionText && actionUrl) {
    html += `<a href="${actionUrl}" class="toast-btn">${actionText}</a>`;
  }
  toast.innerHTML = html;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const size = product.size || "Standard";
  const slug = (product.name || "item").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const id = `${slug}-${size.toLowerCase()}`;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      image: normalizeAssetPath(product.image),
      size: size,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(
    `Added ${quantity} × ${product.name} to cart!`,
    "View Cart",
    getCartPageLink()
  );
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  showToast("Item removed from cart.", "View Cart", getCartPageLink());
}

function updateCartQuantity(id, newQty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = newQty;
      saveCart(cart);
    }
  }
}

function clearCart() {
  saveCart([]);
}

// ==========================================================================
// 4. PRODUCT CARDS & SINGLE PRODUCT HANDLERS
// ==========================================================================
function initProductCards() {
  const cards = document.querySelectorAll(".pro");
  cards.forEach((card) => {
    const cartBtn = card.querySelector(".cart, a:has(.cart)");
    if (cartBtn) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const titleEl = card.querySelector(".des h5");
        const priceEl = card.querySelector(".des h4");
        const imgEl = card.querySelector("img");

        const name = titleEl ? titleEl.textContent.trim() : "Featured Product";
        const price = parsePrice(priceEl ? priceEl.textContent.trim() : "0");
        const image = imgEl ? imgEl.getAttribute("src") : "assets/products/f1.jpg";

        addToCart({
          name: name,
          price: price,
          image: image,
          size: "Standard"
        });
      });
    }
  });
}

function initSingleProductPage() {
  const addBtn = document.getElementById("sp-add-btn") || document.querySelector(".sinle-pro-details button.normal");
  if (!addBtn) return;

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("sp-name") || document.querySelector(".sinle-pro-details h4");
    const priceEl = document.getElementById("sp-price") || document.querySelector(".sinle-pro-details h2");
    const sizeEl = document.getElementById("sp-size") || document.querySelector(".sinle-pro-details select");
    const qtyEl = document.getElementById("sp-qty") || document.querySelector(".sinle-pro-details input[type='number']");
    const mainImg = document.getElementById("mainimg") || document.querySelector(".single-pro-img img");

    const name = nameEl ? nameEl.textContent.trim() : "Store Product";
    const price = parsePrice(priceEl ? priceEl.textContent.trim() : "350");
    const size = sizeEl && sizeEl.value && sizeEl.value !== "Select size" ? sizeEl.value : "M";
    const quantity = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;
    const image = mainImg ? mainImg.getAttribute("src") : "assets/products/f1.jpg";

    addToCart(
      {
        name: name,
        price: price,
        image: image,
        size: size
      },
      quantity
    );
  });
}

// ==========================================================================
// 5. CART PAGE DYNAMIC RENDERING & CHECKOUT
// ==========================================================================
function initCartPage() {
  const cartTable = document.getElementById("cart-table");
  const cartItems = document.getElementById("cart-items");
  const emptyState = document.getElementById("cart-empty");
  const cartAddSection = document.getElementById("cart-add");

  if (!cartItems) return;

  function render() {
    const cart = getCart();
    const activeCoupon = getActiveCoupon();

    if (cart.length === 0) {
      if (cartTable) cartTable.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      if (cartAddSection) cartAddSection.style.display = "none";
      return;
    }

    if (cartTable) cartTable.style.display = "";
    if (emptyState) emptyState.style.display = "none";
    if (cartAddSection) cartAddSection.style.display = "";

    cartItems.innerHTML = cart
      .map((item) => {
        const itemSubtotal = (item.price || 0) * (item.quantity || 1);
        const imgSrc = getDisplayAssetPath(item.image);
        return `
          <tr>
            <td>
              <a href="#" class="remove-btn" data-id="${item.id}" title="Remove item">
                <i class="ri-close-circle-fill"></i>
              </a>
            </td>
            <td><img src="${imgSrc}" alt="${item.name}" /></td>
            <td>
              <strong>${item.name}</strong>
              ${item.size && item.size !== "Standard" ? `<br><small style="color:var(--text-muted)">Size: ${item.size}</small>` : ""}
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <input type="number" min="1" max="99" inputmode="numeric" value="${item.quantity}" data-id="${item.id}" class="cart-qty-input" />
            </td>
            <td><strong>$${itemSubtotal.toFixed(2)}</strong></td>
          </tr>
        `;
      })
      .join("");

    // Quantity change listeners
    cartItems.querySelectorAll(".cart-qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        const val = parseInt(e.target.value, 10);
        updateCartQuantity(id, isNaN(val) || val < 1 ? 1 : val);
        render();
      });
    });

    // Remove item listeners
    cartItems.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.getAttribute("data-id");
        removeFromCart(id);
        render();
      });
    });

    // Calculate totals
    const subtotal = getCartSubtotal();
    let discount = 0;

    if (activeCoupon) {
      if (activeCoupon.type === "percent") {
        discount = subtotal * (activeCoupon.value / 100);
      } else if (activeCoupon.type === "fixed") {
        discount = Math.min(subtotal, activeCoupon.value);
      }
    }

    const total = Math.max(0, subtotal - discount);

    const subtotalEl = document.getElementById("cart-subtotal-val");
    const discountRow = document.getElementById("discount-row");
    const discountEl = document.getElementById("cart-discount-val");
    const totalEl = document.getElementById("cart-total-val");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = "table-row";
        discountEl.textContent = `-$${discount.toFixed(2)} (${activeCoupon.code})`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  render();

  // Coupon application
  const couponBtn = document.getElementById("apply-coupon-btn");
  const couponInput = document.getElementById("coupon-code");
  const couponMsg = document.getElementById("coupon-message");

  if (couponBtn && couponInput) {
    couponBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        if (couponMsg) {
          couponMsg.textContent = "Please enter a coupon code.";
          couponMsg.className = "coupon-message error";
        }
        return;
      }

      const validCoupons = {
        SAVE10: { type: "percent", value: 10, label: "10% off" },
        SAVE20: { type: "percent", value: 20, label: "20% off" },
        SAVE50: { type: "percent", value: 50, label: "50% off" },
        BONPRIX: { type: "fixed", value: 50, label: "$50 off" }
      };

      if (validCoupons[code]) {
        const couponData = { code: code, ...validCoupons[code] };
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
        if (couponMsg) {
          couponMsg.textContent = `Coupon "${code}" applied! (${couponData.label})`;
          couponMsg.className = "coupon-message success";
        }
        render();
      } else {
        if (couponMsg) {
          couponMsg.textContent = "Invalid coupon code. Try SAVE10, SAVE20 or BONPRIX!";
          couponMsg.className = "coupon-message error";
        }
      }
    });
  }

  // Checkout handling
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        showToast("Your cart is empty! Add items first.", "Shop Now", "shop.html");
        return;
      }

      const totalEl = document.getElementById("cart-total-val");
      const totalStr = totalEl ? totalEl.textContent : "$0.00";

      alert(`🎉 Order Placed Successfully!\n\nThank you for shopping with us.\nTotal Charged: ${totalStr}\n\nYour order has been confirmed.`);
      clearCart();
      localStorage.removeItem(COUPON_STORAGE_KEY);
      render();
    });
  }
}

// ==========================================================================
// 6. INITIALIZATION & STAR RATING
// ==========================================================================
function initApp() {
  initTheme();
  updateCartBadges();
  initProductCards();
  initSingleProductPage();
  initCartPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Star Rating Toggle
function myFunction1() {
  const element = document.body;
  element.classList.toggle("star-fill");
}
