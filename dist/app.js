/* ==========================================================================
   DuDu Trà Sữa — menu, filters, local demo cart
   Plain ES2020. No dependencies, no build step.
   The cart is a local demonstration: it never claims an order was sent.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- data --
     Prices are illustrative sample content, not confirmed retail prices.
     `variant` drives the cup artwork so fruit teas never render tapioca.
     ---------------------------------------------------------------------- */
  var PRODUCTS = [
    {
      id: "brown-sugar",
      name: "Sữa Tươi Trân Châu Đường Đen",
      shortName: "Đường Đen",
      price: 45000,
      category: "milk-tea",
      badge: "Gợi ý",
      tone: "caramel",
      color: "#c98545",
      tilt: "-4deg",
      variant: "milk",
      description: "Sữa tươi mát, đường đen thơm caramel, trân châu dẻo ấm.",
    },
    {
      id: "oolong",
      name: "Oolong Sữa Nướng",
      shortName: "Oolong Sữa Nướng",
      price: 42000,
      category: "milk-tea",
      badge: "Đậm trà",
      tone: "cream",
      color: "#b9794b",
      tilt: "3deg",
      variant: "milk",
      description: "Oolong rang thơm, sữa nướng béo nhẹ, hậu vị sạch.",
    },
    {
      id: "strawberry",
      name: "Dâu Kem Sữa",
      shortName: "Dâu Kem Sữa",
      price: 48000,
      category: "milk-tea",
      badge: "Mới",
      tone: "pink",
      color: "#ef7d93",
      tilt: "-2deg",
      variant: "milk",
      description: "Dâu chua ngọt, sữa tươi và lớp kem mằn mặn vui miệng.",
    },
    {
      id: "matcha",
      name: "Matcha Mochi",
      shortName: "Matcha Mochi",
      price: 49000,
      category: "milk-tea",
      badge: "Thơm béo",
      tone: "green",
      color: "#8fb75d",
      tilt: "4deg",
      variant: "milk",
      description: "Matcha đậm vị, sữa mượt và mochi mềm dẻo.",
    },
    {
      id: "peach",
      name: "Trà Đào Cam Sả",
      shortName: "Đào Cam Sả",
      price: 39000,
      category: "fruit-tea",
      badge: "Tươi mát",
      tone: "orange",
      color: "#efa45f",
      tilt: "-3deg",
      variant: "fruit",
      description: "Trà thanh, đào giòn, cam tươi và hương sả dịu.",
    },
    {
      id: "passion",
      name: "Chanh Dây Nha Đam",
      shortName: "Chanh Dây Nha Đam",
      price: 37000,
      category: "fruit-tea",
      badge: "Ít ngọt ngon",
      tone: "berry",
      color: "#d785aa",
      tilt: "2deg",
      variant: "fruit",
      description: "Chanh dây chua sáng vị, nha đam giòn mát, uống là tỉnh.",
    },
  ];

  var STORAGE_KEY = "dudu-cart";
  var CURRENCY = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  var menuGrid = document.getElementById("menu-grid");
  var menuStatus = document.getElementById("menu-status");
  var cartItems = document.getElementById("cart-items");
  var cartEmpty = document.getElementById("cart-empty");
  var cartSummary = document.getElementById("cart-summary");
  var cartTotal = document.getElementById("cart-total");
  var copyStatus = document.getElementById("copy-status");
  var copyButton = document.getElementById("copy-order");
  var toast = document.getElementById("toast");
  var drawer = document.querySelector(".cart-drawer");
  var header = document.querySelector(".site-header");
  var countBadges = document.querySelectorAll(".cart-count");
  var openCartButton = document.querySelector("[data-open-cart]");

  var lastFocused = null;
  var cardTimer = null;

  /* ------------------------------------------------------------ utilities -- */

  function money(amount) {
    return CURRENCY.format(amount);
  }

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function toastMessage(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastMessage.timer);
    toastMessage.timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2000);
  }

  /* ---------------------------------------------------------------- cart -- */

  /**
   * Read the cart defensively. A corrupt value, a storage policy that throws,
   * or a stale id from an older menu must never break rendering.
   */
  function loadCart() {
    var raw = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return {};
    }
    if (!raw) return {};

    var parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return {};
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    var clean = {};
    Object.keys(parsed).forEach(function (id) {
      var quantity = parsed[id];
      if (findProduct(id) && typeof quantity === "number" && isFinite(quantity) && quantity > 0) {
        clean[id] = Math.min(Math.floor(quantity), 99);
      }
    });
    return clean;
  }

  var cart = loadCart();

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      /* Private mode or a full quota: the cart still works for this page view. */
    }
  }

  function cartEntries() {
    var entries = [];
    Object.keys(cart).forEach(function (id) {
      var product = findProduct(id);
      if (product) entries.push({ product: product, quantity: cart[id] });
    });
    return entries;
  }

  function cartCount() {
    var total = 0;
    Object.keys(cart).forEach(function (id) {
      total += cart[id];
    });
    return total;
  }

  function cartTotalValue() {
    var total = 0;
    cartEntries().forEach(function (entry) {
      total += entry.product.price * entry.quantity;
    });
    return total;
  }

  /* ------------------------------------------------------------ rendering -- */

  function cupArt(product, hidden) {
    return (
      '<div class="drink-art"' +
      (hidden ? ' aria-hidden="true"' : "") +
      '><div class="drink-cup drink-cup--' +
      product.variant +
      '" style="--drink:' +
      product.color +
      ";--tilt:" +
      product.tilt +
      '"><span class="cup-fill"></span></div></div>'
    );
  }

  var ICON_PLUS =
    '<svg class="icon-plus" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_CHECK =
    '<svg class="icon-check" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7"/></svg>';

  function renderMenu(filter) {
    if (!menuGrid) return;
    var visible = PRODUCTS.filter(function (product) {
      return filter === "all" || product.category === filter;
    });

    menuGrid.innerHTML = visible
      .map(function (product) {
        return (
          '<li class="menu-card" data-tone="' +
          product.tone +
          '">' +
          '<span class="menu-card-badge">' +
          product.badge +
          "</span>" +
          cupArt(product, true) +
          "<h3>" +
          product.name +
          "</h3>" +
          "<p>" +
          product.description +
          "</p>" +
          '<div class="menu-card-footer">' +
          '<span class="price">' +
          money(product.price) +
          "</span>" +
          '<button class="add-button" type="button" data-add="' +
          product.id +
          '" aria-label="Thêm ' +
          product.name +
          ' vào giỏ">' +
          ICON_PLUS +
          ICON_CHECK +
          "</button>" +
          "</div>" +
          "</li>"
        );
      })
      .join("");

    window.clearTimeout(cardTimer);
    menuGrid.querySelectorAll(".menu-card").forEach(function (card, index) {
      card.style.animationDelay = Math.min(index * 45, 220) + "ms";
    });
  }

  function cartRow(entry) {
    var product = entry.product;
    var quantity = entry.quantity;
    var lineTotal = product.price * quantity;
    return (
      '<li class="cart-item">' +
      "<div>" +
      '<span class="cart-item-name">' +
      product.name +
      "</span>" +
      '<span class="cart-item-unit">' +
      money(product.price) +
      " / ly</span>" +
      (quantity > 1 ? '<span class="cart-item-sub">' + money(lineTotal) + "</span>" : "") +
      "</div>" +
      '<div class="cart-item-actions">' +
      '<button class="qty-button" type="button" data-decrease="' +
      product.id +
      '" aria-label="Giảm một ' +
      product.name +
      '">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>' +
      "</button>" +
      '<span class="cart-item-qty" aria-live="polite">' +
      quantity +
      "</span>" +
      '<button class="qty-button" type="button" data-increase="' +
      product.id +
      '" aria-label="Tăng một ' +
      product.name +
      '">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
      "</button>" +
      "</div>" +
      "</li>"
    );
  }

  function renderCart(focusTarget, previousCount) {
    var entries = cartEntries();
    var count = cartCount();
    var total = cartTotalValue();

    countBadges.forEach(function (badge) {
      badge.textContent = String(count);
      if (typeof previousCount === "number" && previousCount !== count) {
        badge.classList.remove("is-bumping");
        /* Force a reflow so the animation can replay. */
        void badge.offsetWidth;
        badge.classList.add("is-bumping");
      }
    });

    if (openCartButton) {
      openCartButton.setAttribute("aria-label", "Mở giỏ hàng, " + count + " món");
    }

    if (cartEmpty) cartEmpty.hidden = entries.length > 0;
    if (cartSummary) {
      cartSummary.hidden = entries.length === 0;
      measureSummary();
    }
    if (cartTotal) cartTotal.textContent = money(total);
    if (cartItems) cartItems.innerHTML = entries.map(cartRow).join("");

    saveCart();

    /* Re-rendering replaces the DOM, so the control the user just activated no
       longer exists. Put focus back on its equivalent for keyboard users. */
    if (focusTarget && drawer) {
      var action = focusTarget.action === "decrease" ? "decrease" : "increase";
      var next = drawer.querySelector('[data-' + action + '="' + focusTarget.id + '"]');
      if (!next && focusTarget.action === "decrease") {
        /* The row is gone; land on the next row's control, else the close button. */
        next = drawer.querySelector("[data-decrease]") || drawer.querySelector("[data-increase]");
      }
      if (!next) next = drawer.querySelector(".icon-button");
      if (next) next.focus();
    }
  }

  /* ------------------------------------------------------------- drawer --- */

  /**
   * Only the page landmarks OUTSIDE the drawer may be made inert. Querying the
   * bare `header` element would also match the drawer's own header, which would
   * leave the cart with no focusable control at all.
   */
  function backgroundLandmarks() {
    return [
      document.querySelector(".site-header"),
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter(Boolean);
  }

  function openCart() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    /* Inert first: applying inert to the landmark that currently holds focus
       blurs it. The focus system needs that change flushed before the drawer
       can take focus, otherwise the focus() below is silently ignored — hence
       the forced reflow. */
    backgroundLandmarks().forEach(function (node) {
      node.setAttribute("inert", "");
    });
    document.body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");
    void drawer.offsetHeight;
    var focusTarget = drawer.querySelector(".icon-button") || drawer;
    focusTarget.focus();
  }

  function closeCart() {
    if (!drawer) return;
    if (!document.body.classList.contains("drawer-open")) return;
    document.body.classList.remove("drawer-open");
    drawer.setAttribute("aria-hidden", "true");
    backgroundLandmarks().forEach(function (node) {
      node.removeAttribute("inert");
    });
    if (lastFocused && lastFocused.isConnected && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  /* --------------------------------------------------------------- toast -- */

  function flashAddButton(button) {
    if (!button) return;
    button.classList.add("is-added");
    window.setTimeout(function () {
      button.classList.remove("is-added");
    }, 700);
  }

  /* ------------------------------------------------------------- actions -- */

  function addToCart(id, trigger) {
    if (!findProduct(id)) return;
    var before = cartCount();
    cart[id] = (cart[id] || 0) + 1;
    flashAddButton(trigger);
    renderCart(null, before);
    toastMessage("Đã thêm một ly vào giỏ");
  }

  function changeQuantity(id, delta) {
    if (!cart[id]) return;
    var before = cartCount();
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    renderCart({ action: delta > 0 ? "increase" : "decrease", id: id }, before);
    if (delta > 0) toastMessage("Đã thêm một ly vào giỏ");
  }

  /* --------------------------------------------------------------- events -- */

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var addButton = target.closest("[data-add]");
    if (addButton) {
      addToCart(addButton.getAttribute("data-add"), addButton);
      return;
    }

    var increase = target.closest("[data-increase]");
    if (increase) {
      changeQuantity(increase.getAttribute("data-increase"), 1);
      return;
    }

    var decrease = target.closest("[data-decrease]");
    if (decrease) {
      changeQuantity(decrease.getAttribute("data-decrease"), -1);
      return;
    }

    if (target.closest("[data-open-cart]")) {
      openCart();
      return;
    }

    if (target.closest("[data-close-cart]")) {
      var goToMenu = !!target.closest("[data-goto-menu]");
      closeCart();
      if (goToMenu) {
        var menu = document.getElementById("menu");
        if (menu) menu.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  var filterChips = document.querySelectorAll(".filter-chip");
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach(function (other) {
        var active = other === chip;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      var filter = chip.getAttribute("data-filter");
      renderMenu(filter);
      if (menuStatus) {
        var label = chip.textContent.trim();
        var shown = menuGrid ? menuGrid.children.length : 0;
        menuStatus.textContent = "Đang hiện " + shown + " món trong nhóm " + label + ".";
      }
    });
  });

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      var entries = cartEntries();
      if (!entries.length) return;

      var lines = entries.map(function (entry) {
        return (
          "- " + entry.quantity + " × " + entry.product.name + ": " + money(entry.product.price * entry.quantity)
        );
      });
      var order = [
        "Đơn DuDu (bản thử)",
        "",
      ]
        .concat(lines)
        .concat([
          "",
          "Tổng: " + money(cartTotalValue()),
          "Ghi chú: đơn minh hoạ, vui lòng xác nhận giá và kênh nhận đơn với DuDu.",
        ])
        .join("\n");

      var done = function (ok) {
        var label = copyButton.querySelector(".copy-label");
        if (ok) {
          copyButton.classList.add("is-copied");
          if (label) label.textContent = "Đã sao chép";
          if (copyStatus) copyStatus.textContent = "Đã sao chép đơn — bạn dán vào tin nhắn để gửi DuDu nhé.";
        } else {
          if (copyStatus) {
            copyStatus.textContent = "Trình duyệt chặn sao chép tự động. Bạn hãy chọn nội dung đơn và sao chép thủ công.";
          }
        }
        window.setTimeout(function () {
          copyButton.classList.remove("is-copied");
          if (label) label.textContent = "Sao chép đơn hàng";
        }, 2400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(order).then(
          function () {
            done(true);
          },
          function () {
            done(false);
          }
        );
      } else {
        done(false);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("drawer-open")) {
      closeCart();
    }
  });

  /* Keep the drawer's semantics honest if something closes it externally. */
  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }, { passive: true });

  /* Publish the cart summary's real height so the toast can dock above it and
     never cover the copy button, whatever the viewport. */
  function measureSummary() {
    if (!cartSummary) return;
    var height = cartSummary.hidden ? 0 : cartSummary.offsetHeight;
    document.documentElement.style.setProperty("--summary-h", height + "px");
  }

  if (cartSummary && typeof window.ResizeObserver === "function") {
    new window.ResizeObserver(measureSummary).observe(cartSummary);
  }
  window.addEventListener("resize", measureSummary, { passive: true });
  measureSummary();

  /* ---------------------------------------------------------------- start -- */

  renderMenu("all");
  renderCart();
})();
