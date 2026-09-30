import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const executablePath = process.env.BROWSER_EXECUTABLE || undefined;
const baseURL = process.env.DUDU_BASE_URL || "http://127.0.0.1:4173/";
const viewports = [[320, 568], [390, 844], [768, 1024], [1024, 768], [1440, 900]];
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function recordConsoleError(errors, message) {
  if (message.type() !== "error") return;
  const text = message.text();
  if (/Failed to load resource: net::ERR_(NETWORK_CHANGED|INTERNET_DISCONNECTED)/.test(text)) return;
  errors.push(text);
}

const browser = await chromium.launch({ executablePath, headless: true });

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => recordConsoleError(errors, message));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator("[data-customize]").first().click();
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(() => {
    const dialog = document.querySelector(".custom-dialog");
    const targets = [...dialog.querySelectorAll(
      ".chip-content, .pill-chip > span, .topping-item, .stepper-button, .icon-button, #add-configured-item, .custom-cart-link"
    )].filter((node) => getComputedStyle(node).visibility !== "hidden" && !node.hidden);
    const textBoxes = [...dialog.querySelectorAll(".chip-content, .pill-chip > span, .topping-name, .option-legend")];
    const overflowing = [...dialog.querySelectorAll("*")].filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
    });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowing: overflowing.map((node) => node.className || node.tagName).slice(0, 8),
      smallTargets: targets.map((node) => {
        const rect = node.getBoundingClientRect();
        return { label: node.className || node.id, width: rect.width, height: rect.height };
      }).filter((item) => item.width < 44 || item.height < 44),
      clippedText: textBoxes.map((node) => ({
        label: node.textContent.trim(),
        delta: node.scrollHeight - node.clientHeight,
      })).filter((item) => item.delta > 1),
      dialogOpen: document.body.classList.contains("custom-open") && dialog.getAttribute("aria-hidden") === "false",
    };
  });

  check(metrics.dialogOpen, `${width}x${height}: dialog did not open`);
  check(metrics.scrollWidth === metrics.clientWidth, `${width}x${height}: document overflow ${metrics.scrollWidth}/${metrics.clientWidth}`);
  check(metrics.overflowing.length === 0, `${width}x${height}: elements outside viewport ${metrics.overflowing.join(", ")}`);
  check(metrics.smallTargets.length === 0, `${width}x${height}: targets below 44px ${JSON.stringify(metrics.smallTargets)}`);
  check(metrics.clippedText.length === 0, `${width}x${height}: clipped text ${JSON.stringify(metrics.clippedText)}`);
  check(errors.length === 0, `${width}x${height}: console errors ${errors.join(" | ")}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator("[data-open-cart]").first().click();
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press("Tab");
    check(await page.evaluate(() => document.querySelector(".cart-drawer").contains(document.activeElement)), `focus escaped empty cart at Tab ${i + 1}`);
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => recordConsoleError(errors, message));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const configure = async (quantity) => {
    await page.locator("[data-customize]").first().click();
    await page.locator('label:has(input[name="drink-size"][value="L"])').click();
    await page.locator('label:has(input[name="drink-sugar"][value="70"])').click();
    await page.locator('label:has(input[name="drink-ice"][value="30"])').click();
    for (const id of ["pearls", "aloe", "waterchestnut"]) await page.locator(`label:has(input[value="${id}"])`).click();
    if (quantity === 2) await page.locator("[data-custom-increase]").click();
  };

  await configure(2);
  check(await page.locator('input[name="drink-topping"]:disabled').count() === 2, "topping limit did not disable the remaining two options");
  check((await page.locator("#add-configured-item").innerText()).includes("134.000"), "live price did not reach 134.000 ₫");
  await page.locator("#add-configured-item").click();
  check(!(await page.locator("body").evaluate((node) => node.classList.contains("custom-open"))), "dialog remained open after add");
  check(await page.locator(".cart-count").first().innerText() === "2", "cart badge was not 2 after first add");

  await configure(1);
  await page.locator("#add-configured-item").click();
  await page.locator("[data-open-cart]").first().click();
  check(await page.locator(".cart-item").count() === 1, "same configuration was not merged");
  check(await page.locator(".cart-item-qty").innerText() === "3", "merged quantity was not 3");
  await page.locator(".cart-drawer [data-close-cart]").first().click();

  await page.locator("[data-customize]").first().click();
  await page.locator("#add-configured-item").click();
  await page.locator("[data-open-cart]").first().click();
  check(await page.locator(".cart-item").count() === 2, "different configuration did not create a second row");
  await page.locator(".cart-drawer [data-close-cart]").first().click();

  await page.locator("[data-customize]").first().click();
  await page.locator(".custom-cart-link").click();
  const overlay = await page.evaluate(() => ({
    custom: document.body.classList.contains("custom-open"),
    cart: document.body.classList.contains("drawer-open"),
    drawerInert: document.querySelector(".cart-drawer").hasAttribute("inert"),
  }));
  check(!overlay.custom && overlay.cart && !overlay.drawerInert, `one-overlay invariant failed ${JSON.stringify(overlay)}`);
  await page.keyboard.press("Escape");
  check(!(await page.locator("body").evaluate((node) => node.classList.contains("drawer-open"))), "Escape did not close cart");

  await page.locator("[data-customize]").first().focus();
  await page.keyboard.press("Enter");
  check(await page.evaluate(() => document.activeElement?.matches('input[name="drink-size"][value="M"]')), "initial focus was not Size M");
  for (let i = 0; i < 14; i += 1) {
    await page.keyboard.press("Tab");
    check(await page.evaluate(() => document.querySelector(".custom-dialog").contains(document.activeElement)), `focus escaped dialog at Tab ${i + 1}`);
  }
  await page.keyboard.press("Escape");
  check(await page.evaluate(() => document.activeElement?.hasAttribute("data-customize")), "focus did not return to the product button");
  check(errors.length === 0, `interaction console errors ${errors.join(" | ")}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.evaluate(() => {
    localStorage.setItem("dudu-cart-v2", JSON.stringify({
      version: 2,
      items: [{ productId: "brown-sugar", size: "constructor", sugar: 33, ice: 70, toppings: ["pearls", "pearls", "mochi"], quantity: 999, unitPrice: 1 }],
    }));
  });
  await page.reload();
  await page.locator("[data-open-cart]").first().click();
  await page.waitForTimeout(400);
  const cartText = await page.locator(".cart-drawer").innerText();
  const stored = await page.evaluate(() => localStorage.getItem("dudu-cart-v2"));
  check(cartText.includes("Size M"), `tampered size did not normalize to Size M: text=${JSON.stringify(cartText)} storage=${stored}`);
  check(!cartText.includes("NaN") && !cartText.includes("undefined"), "tampered storage produced NaN/undefined");
  check(await page.locator(".cart-item-qty").innerText() === "20", `quantity 999 did not clamp to 20: text=${JSON.stringify(cartText)} storage=${stored}`);
  check(await page.locator("[data-increase]:disabled").count() === 1, "cart increase button was not disabled at quantity 20");
  await page.locator(".cart-drawer [data-close-cart]").first().click();
  await page.locator("[data-customize]").first().click();
  const motion = await page.locator(".custom-dialog").evaluate((node) => {
    const style = getComputedStyle(node);
    return { duration: style.transitionDuration, transform: style.transform };
  });
  check(motion.duration === "1e-05s" || motion.duration === "0.00001s" || motion.duration === "0s", `reduced-motion duration unexpected: ${motion.duration}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.evaluate(() => {
    const products = ["oolong", "strawberry", "matcha", "peach", "passion"];
    const items = [];
    products.forEach((productId) => {
      ["M", "L"].forEach((size) => {
        [100, 70].forEach((sugar) => items.push({ productId, size, sugar, ice: 70, toppings: [], quantity: 1 }));
      });
    });
    localStorage.setItem("dudu-cart-v2", JSON.stringify({ version: 2, items }));
  });
  await page.reload();
  await page.locator("[data-customize]").first().click();
  check(await page.locator("#add-configured-item").isDisabled(), "new configuration CTA was not disabled at 20 cart lines");
  check((await page.locator("#custom-status").textContent()).includes("20 cấu hình"), "20-line limit was not announced");
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ checks, failures: failures.length, details: failures }, null, 2));
if (failures.length) process.exitCode = 1;
