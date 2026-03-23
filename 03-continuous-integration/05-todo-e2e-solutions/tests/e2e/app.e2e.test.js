import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("lägga till en todo", async ({ page }) => {
  await page.fill("#todo-input", "Handla mat");
  await page.click('button[type="submit"]');

  const items = page.locator(".todo-item");
  await expect(items).toHaveCount(1);
  await expect(items.first().locator(".todo-text")).toHaveText("Handla mat");
});

test("lägga till flera todos", async ({ page }) => {
  await page.fill("#todo-input", "Handla mat");
  await page.click('button[type="submit"]');
  await page.fill("#todo-input", "Städa");
  await page.click('button[type="submit"]');
  await page.fill("#todo-input", "Koda");
  await page.click('button[type="submit"]');

  const items = page.locator(".todo-item");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).locator(".todo-text")).toHaveText("Handla mat");
  await expect(items.nth(1).locator(".todo-text")).toHaveText("Städa");
  await expect(items.nth(2).locator(".todo-text")).toHaveText("Koda");
});

test("ta bort en todo", async ({ page }) => {
  await page.fill("#todo-input", "Handla mat");
  await page.click('button[type="submit"]');
  await page.fill("#todo-input", "Städa");
  await page.click('button[type="submit"]');

  await expect(page.locator(".todo-item")).toHaveCount(2);

  await page.locator(".todo-item").first().locator(".todo-remove").click();

  const items = page.locator(".todo-item");
  await expect(items).toHaveCount(1);
  await expect(items.first().locator(".todo-text")).toHaveText("Städa");
});

test("rensa alla todos", async ({ page }) => {
  await page.fill("#todo-input", "Handla mat");
  await page.click('button[type="submit"]');
  await page.fill("#todo-input", "Städa");
  await page.click('button[type="submit"]');

  await expect(page.locator(".todo-item")).toHaveCount(2);

  await page.click("#clear-btn");

  await expect(page.locator(".todo-item")).toHaveCount(0);
});

test("toggla done på en todo", async ({ page }) => {
  await page.fill("#todo-input", "Handla mat");
  await page.click('button[type="submit"]');

  const item = page.locator(".todo-item").first();
  await expect(item).not.toHaveClass(/done/);

  await item.locator(".todo-done").click();
  await expect(item).toHaveClass(/done/);

  await item.locator(".todo-done").click();
  await expect(item).not.toHaveClass(/done/);
});
