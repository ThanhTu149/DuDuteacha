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

  var STORAGE_KEY = "dudu-cart-v2";
  var LEGACY_STORAGE_KEY = "dudu-cart";
  var MAX_QTY = 20;
  var MAX_CART_LINES = 20;
  var MAX_TOPPINGS = 3;
  var SIZES = {
    M: { label: "Size M", surcharge: 0 },
    L: { label: "Size L", surcharge: 6000 },
  };
  var SUGARS = [100, 70, 50, 30, 0];
  var ICES = [100, 70, 30, 0];
  var TOPPINGS = [
    { id: "pearls", name: "Trân châu dẻo đường đen", price: 5000 },
    { id: "aloe", name: "Thạch nha đam giòn", price: 5000 },
    { id: "waterchestnut", name: "Thạch củ năng", price: 6000 },
    { id: "cheesefoam", name: "Kem cheese béo mặn", price: 10000 },
    { id: "mochi", name: "Mochi kéo sợi", price: 8000 },
  ];
  var DEFAULT_CUSTOMIZATION = { size: "M", sugar: 50, ice: 70, toppings: [], quantity: 1 };
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
  var customBackdrop = document.querySelector(".custom-backdrop");
  var customDialog = document.getElementById("custom-dialog");
  var customTitle = document.getElementById("custom-title");
  var customProductNote = document.getElementById("custom-product-note");
  var customUnitPrice = document.getElementById("custom-unit-price");
  var customQuantity = document.getElementById("custom-quantity");
  var customStatus = document.getElementById("custom-status");
  var addConfiguredButton = document.getElementById("add-configured-item");

  var lastFocused = null;
  var customLastFocused = null;
  var customState = null;
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

  function findTopping(id) {
    for (var i = 0; i < TOPPINGS.length; i++) {
      if (TOPPINGS[i].id === id) return TOPPINGS[i];
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

  function canonicalToppings(ids) {
    var requested = Object.create(null);
    (Array.isArray(ids) ? ids : []).forEach(function (id) {
      if (findTopping(id)) requested[id] = true;
    });
    return TOPPINGS.filter(function (topping) { return requested[topping.id]; })
      .slice(0, MAX_TOPPINGS)
      .map(function (topping) { return topping.id; });
  }

  function makeConfigKey(productId, config) {
    var toppingPart = canonicalToppings(config.toppings).join("-") || "none";
    return [productId, config.size, config.sugar, config.ice, toppingPart].join("__");
  }

  function normalizeRecord(record) {
    if (!record || typeof record !== "object" || !findProduct(record.productId)) return null;
    var size = Object.prototype.hasOwnProperty.call(SIZES, record.size) ? record.size : DEFAULT_CUSTOMIZATION.size;
    var sugar = SUGARS.indexOf(Number(record.sugar)) >= 0 ? Number(record.sugar) : DEFAULT_CUSTOMIZATION.sugar;
    var ice = ICES.indexOf(Number(record.ice)) >= 0 ? Number(record.ice) : DEFAULT_CUSTOMIZATION.ice;
    var toppings = canonicalToppings(record.toppings);
    var rawQuantity = Number(record.quantity);
    if (!Number.isFinite(rawQuantity) || rawQuantity <= 0) return null;
    var quantity = Math.min(MAX_QTY, Math.floor(rawQuantity));
    if (quantity < 1) return null;
    var normalized = { productId: record.productId, size: size, sugar: sugar, ice: ice, toppings: toppings, quantity: quantity };
    normalized.key = makeConfigKey(record.productId, normalized);
    return normalized;
  }

  function unitPriceOf(record) {
    var product = findProduct(record.productId);
    if (!product) return 0;
    var size = Object.prototype.hasOwnProperty.call(SIZES, record.size) ? SIZES[record.size] : SIZES[DEFAULT_CUSTOMIZATION.size];
    var toppingTotal = canonicalToppings(record.toppings).reduce(function (sum, id) {
      var topping = findTopping(id);
      return sum + (topping ? topping.price : 0);
    }, 0);
    return product.price + size.surcharge + toppingTotal;
  }

  function describeConfig(record) {
    var size = Object.prototype.hasOwnProperty.call(SIZES, record.size) ? SIZES[record.size] : SIZES[DEFAULT_CUSTOMIZATION.size];
    var parts = [size.label, record.sugar + "% đường", record.ice + "% đá"];
    var names = canonicalToppings(record.toppings).map(function (id) { return findTopping(id).name; });
    if (names.length) parts.push("thêm: " + names.join(", "));
    return parts.join(" · ");
  }

  function mergeRecords(records) {
    return (Array.isArray(records) ? records : []).reduce(function (merged, rawRecord) {
      var record = normalizeRecord(rawRecord);
      if (!record) return merged;
      var existing = merged.find(function (item) { return item.key === record.key; });
      if (existing) existing.quantity = Math.min(MAX_QTY, existing.quantity + record.quantity);
      else merged.push(record);
      return merged;
    }, []);
  }

  /** Read v2 defensively, or migrate the legacy flat object exactly once. */
  function loadCart() {
    var raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return [];
    }

    if (raw) {
      try {
        var payload = JSON.parse(raw);
        var source = payload && Array.isArray(payload.items) ? payload.items : [];
        return mergeRecords(source);
      } catch (error) {
        return [];
      }
    }

    try {
      var legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      var legacy = legacyRaw ? JSON.parse(legacyRaw) : null;
      if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return [];
      var migrated = mergeRecords(Object.keys(legacy).map(function (productId) {
        return {
          productId: productId,
          size: DEFAULT_CUSTOMIZATION.size,
          sugar: DEFAULT_CUSTOMIZATION.sugar,
          ice: DEFAULT_CUSTOMIZATION.ice,
          toppings: [],
          quantity: legacy[productId],
        };
      }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, items: migrated }));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migrated;
    } catch (error) {
      return [];
    }
  }

  var cart = loadCart();

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, items: cart }));
    } catch (error) {
      /* Private mode or a full quota: the cart still works for this page view. */
    }
  }

  function cartEntries() {
    return cart.map(function (record) {
      return { record: record, product: findProduct(record.productId), quantity: record.quantity, unitPrice: unitPriceOf(record) };
    }).filter(function (entry) { return !!entry.product; });
  }

  function cartCount() {
    var total = 0;
    cart.forEach(function (record) { total += record.quantity; });
    return total;
  }

  function cartTotalValue() {
    var total = 0;
    cartEntries().forEach(function (entry) {
      total += entry.unitPrice * entry.quantity;
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
          '<button class="add-button" type="button" aria-haspopup="dialog" data-customize="' +
          product.id +
          '" aria-label="Tùy chỉnh ' +
          product.name +
          ' trước khi thêm vào giỏ">' +
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
    var record = entry.record;
    var quantity = entry.quantity;
    var lineTotal = entry.unitPrice * quantity;
    var toppingNames = record.toppings.map(function (id) { return findTopping(id).name; });
    return (
      '<li class="cart-item">' +
      "<div>" +
      '<span class="cart-item-name">' +
      product.name +
      "</span>" +
      '<span class="cart-item-config"><b>' + SIZES[record.size].label + '</b> · ' + record.sugar + '% đường · ' + record.ice + '% đá</span>' +
      (toppingNames.length ? '<span class="cart-item-toppings">+ ' + toppingNames.join(", ") + "</span>" : "") +
      '<span class="cart-item-unit">' +
      money(entry.unitPrice) +
      " / ly</span>" +
      (quantity > 1 ? '<span class="cart-item-sub">' + money(lineTotal) + "</span>" : "") +
      "</div>" +
      '<div class="cart-item-actions">' +
      '<button class="qty-button" type="button" data-decrease="' +
      record.key +
      '" aria-label="Giảm một ' +
      product.name +
      '">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>' +
      "</button>" +
      '<span class="cart-item-qty" aria-live="polite">' +
      quantity +
      "</span>" +
      '<button class="qty-button" type="button" data-increase="' +
      record.key +
      '" aria-label="Tăng một ' +
      product.name +
      '"' +
      (quantity >= MAX_QTY ? ' disabled aria-disabled="true"' : '') +
      '>' +
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
      var next = drawer.querySelector('[data-' + action + '="' + focusTarget.key + '"]');
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
      document.querySelector(".skip-link"),
      document.querySelector(".site-header"),
      document.querySelector("main"),
      document.querySelector("footer"),
    ].filter(Boolean);
  }

  function openCart() {
    if (!drawer) return;
    var focusReturn = document.body.classList.contains("custom-open") ? customLastFocused : document.activeElement;
    if (document.body.classList.contains("custom-open")) closeCustomization(false);
    lastFocused = focusReturn;
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

  function closeCart(restoreFocus) {
    if (!drawer) return;
    if (!document.body.classList.contains("drawer-open")) return;
    document.body.classList.remove("drawer-open");
    drawer.setAttribute("aria-hidden", "true");
    backgroundLandmarks().forEach(function (node) {
      node.removeAttribute("inert");
    });
    if (restoreFocus !== false && lastFocused && lastFocused.isConnected && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  /* --------------------------------------------------------------- toast -- */

  function flashAddButton(button) {
    if (!(button instanceof HTMLElement)) return;
    button.classList.add("is-added");
    window.setTimeout(function () {
      button.classList.remove("is-added");
    }, 700);
  }

  function trapModalFocus(event, container) {
    if (event.key !== "Tab" || !container) return false;
    var focusable = Array.prototype.slice.call(container.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(function (node) {
      var style = window.getComputedStyle(node);
      return style.visibility !== "hidden" && style.display !== "none" && node.getClientRects().length > 0;
    });
    if (!focusable.length) {
      event.preventDefault();
      container.focus();
      return true;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  /* ------------------------------------------------------------- actions -- */

  function customizationInputs(selector) {
    return customDialog ? Array.prototype.slice.call(customDialog.querySelectorAll(selector)) : [];
  }

  function syncCustomizationForm() {
    if (!customState || !customDialog) return;
    customizationInputs('input[name="drink-size"]').forEach(function (input) { input.checked = input.value === customState.size; });
    customizationInputs('input[name="drink-sugar"]').forEach(function (input) { input.checked = Number(input.value) === customState.sugar; });
    customizationInputs('input[name="drink-ice"]').forEach(function (input) { input.checked = Number(input.value) === customState.ice; });
    customizationInputs('input[name="drink-topping"]').forEach(function (input) { input.checked = customState.toppings.indexOf(input.value) >= 0; });
    syncToppingLimit();
    updateCustomizationUI(false);
  }

  function syncToppingLimit() {
    if (!customState) return;
    var atLimit = customState.toppings.length >= MAX_TOPPINGS;
    customizationInputs('input[name="drink-topping"]').forEach(function (input) {
      var disabled = atLimit && !input.checked;
      input.disabled = disabled;
      input.setAttribute("aria-disabled", String(disabled));
    });
  }

  function customDraftRecord() {
    return normalizeRecord({
      productId: customState.productId,
      size: customState.size,
      sugar: customState.sugar,
      ice: customState.ice,
      toppings: customState.toppings,
      quantity: customState.quantity,
    });
  }

  function updateCustomizationUI(announce) {
    if (!customState) return;
    var record = customDraftRecord();
    if (!record) return;
    var product = findProduct(record.productId);
    var unit = unitPriceOf(record);
    var line = unit * record.quantity;
    if (customTitle) customTitle.textContent = product.name;
    if (customProductNote) customProductNote.textContent = product.description + " · Giá gốc " + money(product.price);
    if (customUnitPrice) customUnitPrice.textContent = money(unit) + " / ly";
    if (customQuantity) customQuantity.textContent = String(record.quantity);
    if (addConfiguredButton) addConfiguredButton.querySelector("span").textContent = "Thêm vào giỏ · " + money(line);
    var decrease = customDialog.querySelector("[data-custom-decrease]");
    var increase = customDialog.querySelector("[data-custom-increase]");
    if (decrease) {
      decrease.disabled = record.quantity <= 1;
      decrease.setAttribute("aria-disabled", String(record.quantity <= 1));
    }
    if (increase) {
      increase.disabled = record.quantity >= MAX_QTY;
      increase.setAttribute("aria-disabled", String(record.quantity >= MAX_QTY));
    }
    var isNewLine = !cart.some(function (item) { return item.key === record.key; });
    var atLineLimit = isNewLine && cart.length >= MAX_CART_LINES;
    if (addConfiguredButton) {
      addConfiguredButton.disabled = atLineLimit;
      addConfiguredButton.setAttribute("aria-disabled", String(atLineLimit));
    }
    if (announce && customStatus) {
      customStatus.textContent = atLineLimit
        ? "Giỏ đã đạt tối đa " + MAX_CART_LINES + " cấu hình. Hãy bớt một dòng trước khi thêm cấu hình mới."
        : describeConfig(record) + ". Số lượng " + record.quantity + ", tạm tính " + money(line) + ".";
    } else if (customStatus) {
      customStatus.textContent = atLineLimit
        ? "Giỏ đã đạt tối đa " + MAX_CART_LINES + " cấu hình. Hãy bớt một dòng trước khi thêm cấu hình mới."
        : "";
    }
  }

  function openCustomization(productId, trigger) {
    if (!customDialog || !findProduct(productId)) return;
    if (document.body.classList.contains("drawer-open")) closeCart(false);
    customLastFocused = trigger || document.activeElement;
    customState = {
      productId: productId,
      size: DEFAULT_CUSTOMIZATION.size,
      sugar: DEFAULT_CUSTOMIZATION.sugar,
      ice: DEFAULT_CUSTOMIZATION.ice,
      toppings: [],
      quantity: 1,
    };
    syncCustomizationForm();
    backgroundLandmarks().concat([drawer]).filter(Boolean).forEach(function (node) { node.setAttribute("inert", ""); });
    document.body.classList.add("custom-open");
    customDialog.setAttribute("aria-hidden", "false");
    void customDialog.offsetHeight;
    var first = customDialog.querySelector('input[name="drink-size"][value="M"]');
    if (first) first.focus();
  }

  function closeCustomization(restoreFocus) {
    if (!customDialog || !document.body.classList.contains("custom-open")) return;
    document.body.classList.remove("custom-open");
    customDialog.setAttribute("aria-hidden", "true");
    backgroundLandmarks().concat([drawer]).filter(Boolean).forEach(function (node) { node.removeAttribute("inert"); });
    if (restoreFocus !== false) {
      var focusReturn = customLastFocused && customLastFocused.isConnected ? customLastFocused : openCartButton;
      if (focusReturn && typeof focusReturn.focus === "function") focusReturn.focus();
    }
    customLastFocused = null;
    customState = null;
  }

  function addConfiguredToCart() {
    if (!customState) return;
    var before = cartCount();
    var record = customDraftRecord();
    if (!record) return;
    var existing = cart.find(function (item) { return item.key === record.key; });
    if (!existing && cart.length >= MAX_CART_LINES) {
      updateCustomizationUI(true);
      return;
    }
    if (existing) existing.quantity = Math.min(MAX_QTY, existing.quantity + record.quantity);
    else cart.push(record);
    var trigger = customLastFocused;
    var product = findProduct(record.productId);
    closeCustomization(true);
    flashAddButton(trigger);
    renderCart(null, before);
    var added = cartCount() - before;
    toastMessage(added > 0
      ? "Đã thêm " + product.shortName + " (" + record.size + ") vào giỏ"
      : "Cấu hình này đã đạt tối đa " + MAX_QTY + " ly");
  }

  function changeQuantity(key, delta) {
    var index = cart.findIndex(function (item) { return item.key === key; });
    if (index < 0) return;
    var before = cartCount();
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    else cart[index].quantity = Math.min(MAX_QTY, cart[index].quantity);
    renderCart({ action: delta > 0 ? "increase" : "decrease", key: key }, before);
    if (delta > 0) toastMessage("Đã thêm một ly vào giỏ");
  }

  /* --------------------------------------------------------------- events -- */

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var customizeButton = target.closest("[data-customize]");
    if (customizeButton) {
      openCustomization(customizeButton.getAttribute("data-customize"), customizeButton);
      return;
    }

    if (target.closest("[data-close-custom]")) {
      closeCustomization(true);
      return;
    }

    if (target.closest("[data-custom-decrease]")) {
      if (customState) customState.quantity = Math.max(1, customState.quantity - 1);
      updateCustomizationUI(true);
      return;
    }

    if (target.closest("[data-custom-increase]")) {
      if (customState) customState.quantity = Math.min(MAX_QTY, customState.quantity + 1);
      updateCustomizationUI(true);
      return;
    }

    if (target.closest("#add-configured-item")) {
      addConfiguredToCart();
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

  if (customDialog) {
    customDialog.addEventListener("change", function (event) {
      var input = event.target;
      if (!(input instanceof HTMLInputElement) || !customState) return;
      if (input.name === "drink-size") customState.size = input.value;
      if (input.name === "drink-sugar") customState.sugar = Number(input.value);
      if (input.name === "drink-ice") customState.ice = Number(input.value);
      if (input.name === "drink-topping") {
        customState.toppings = customizationInputs('input[name="drink-topping"]:checked').map(function (node) { return node.value; });
        customState.toppings = canonicalToppings(customState.toppings);
        syncToppingLimit();
      }
      updateCustomizationUI(true);
    });
  }

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
          "- " + entry.quantity + " × " + entry.product.name + " (" + describeConfig(entry.record).replace(/ · /g, ", ") + "): " + money(entry.unitPrice * entry.quantity)
        );
      });
      var order = [
        "Đơn DuDu (bản thử)",
        "",
      ]
        .concat(lines)
        .concat([
          "",
          "Tổng tạm tính: " + money(cartTotalValue()),
          "Ghi chú: đơn minh hoạ, vui lòng xác nhận giá và kênh nhận đơn với DuDu.",
        ])
        .join("\n");

      var done = function (ok) {
        var label = copyButton.querySelector(".copy-label");
        if (ok) {
          copyButton.classList.add("is-copied");
          if (label) label.textContent = "Đã sao chép";
          if (copyStatus) copyStatus.textContent = "Đã sao chép bản nháp đơn hàng trên thiết bị của bạn.";
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
    if (event.key === "Tab" && document.body.classList.contains("custom-open")) {
      trapModalFocus(event, customDialog);
      return;
    }
    if (event.key === "Tab" && document.body.classList.contains("drawer-open")) {
      trapModalFocus(event, drawer);
      return;
    }
    if (event.key === "Escape") {
      var customWasOpen = document.body.classList.contains("custom-open");
      var cartWasOpen = document.body.classList.contains("drawer-open");
      if (customWasOpen) closeCustomization(!cartWasOpen);
      if (cartWasOpen) closeCart();
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
