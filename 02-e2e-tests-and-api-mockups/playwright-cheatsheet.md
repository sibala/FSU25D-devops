# Playwright E2E Testing Cheatsheet

## Table of Contents

- [Test Structure](#test-structure)
- [Navigation](#navigation)
- [Locators](#locators)
- [Actions](#actions)
- [Assertions](#assertions)
- [Working with Multiple Elements](#working-with-multiple-elements)
- [Recommended Reading](#recommended-reading)

---

## Test Structure

### Basic test

```js
import { test, expect } from "@playwright/test";

test("description of what this test verifies", async ({ page }) => {
  // test body
});
```

### Lifecycle hooks

```js
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
```

> Runs before **every** test in the file. Useful for shared setup like navigating to the start page.

---

## Navigation

```js
await page.goto("/");           // relative path (uses baseURL from config)
await page.goto("https://...");  // absolute URL
```

---

## Locators

Locators are the core way to find elements on the page. They are **lazy** — they don't query the DOM until you perform an action or assertion.

| Pattern | Example | Selects |
|---|---|---|
| CSS id | `page.locator("#todo-input")` | `<input id="todo-input">` |
| CSS class | `page.locator(".post-card")` | `<div class="post-card">` |
| Tag + attribute | `page.locator('button[type="submit"]')` | `<button type="submit">` |
| Tag + attribute (input) | `page.locator('input[type="checkbox"]')` | `<input type="checkbox">` |
| Nested selector | `page.locator("#tag-filter option")` | `<option>` inside `#tag-filter` |

### Narrowing locators

```js
const item = page.locator(".todo-item");

// Chain a child locator
item.locator(".todo-text");
item.locator('input[type="checkbox"]');

// Pick by index (0-based)
page.locator(".post-card").first();   // first element
page.locator("option").nth(1);       // second element
```

---

## Actions

### Fill an input field

```js
await page.fill("#todo-input", "Handla mat");
```

> Clears the field first, then types the value.

### Click an element

```js
await page.click('button[type="submit"]');
await page.click(".todo-remove");
```

### Check / uncheck a checkbox

```js
await checkbox.check();
await checkbox.uncheck();
```

### Select a dropdown option

```js
await page.locator("#tag-filter").selectOption(value);
```

### Get an attribute value

```js
let value = await page.locator("option").nth(1).getAttribute("value");
```

---

## Assertions

All assertions use `expect` from `@playwright/test`. Web-first assertions **auto-wait** until the condition is met (default 5s timeout).

### Element count

```js
await expect(page.locator(".todo-item")).toHaveCount(1);
await expect(page.locator(".todo-item")).toHaveCount(0);
await expect(page.locator(".post-card")).not.toHaveCount(0);
```

### Text content

```js
await expect(item.locator(".todo-text")).toHaveText("Handla mat");
await expect(page.locator("#todo-stats")).toHaveText("1/2 klara — 1 kvar");
await expect(options.first()).toHaveText("Alla");
```

### Input value

```js
await expect(page.locator("#todo-input")).toHaveValue("");
```

### CSS class (regex)

```js
await expect(item).toHaveClass(/done/);
await expect(item).not.toHaveClass(/done/);
```

### Visibility

```js
await expect(page.locator(".post-card").first()).toBeVisible();
```

### Negation

Prefix any assertion with `.not`:

```js
await expect(locator).not.toHaveCount(0);
await expect(locator).not.toHaveClass(/done/);
```

### Non-retrying (generic) assertions

These use plain `expect()` **without** `await` — they run once and do not auto-wait:

```js
expect(await options.count()).toBeGreaterThan(1);
expect(texts).toEqual(["Första", "Andra", "Tredje"]);
expect(meta).toContain(secondOption);
```

> **Key distinction:** `await expect(locator).toHaveCount(n)` retries until true.
> `expect(await locator.count()).toBe(n)` evaluates once — no retry.

---

## Working with Multiple Elements

### Get all text contents as an array

```js
const texts = await page.locator(".todo-text").allTextContents();
// returns: ["Första", "Andra", "Tredje"]
```

### Count elements

```js
const n = await page.locator("option").count();
```

### Iterate and assert

```js
let metaTexts = await page.locator(".post-meta").allTextContents();
for (let meta of metaTexts) {
  expect(meta).toContain(expectedValue);
}
```

---

## Recommended Reading

Start with these pages from the [Playwright docs](https://playwright.dev/docs/intro):

| Topic | URL | Why |
|---|---|---|
| **Getting Started** | https://playwright.dev/docs/intro | Setup, first test, running tests |
| **Locators** | https://playwright.dev/docs/locators | All locator strategies (CSS, role, text, etc.) |
| **Actions** | https://playwright.dev/docs/input | `fill`, `click`, `check`, `selectOption`, and more |
| **Assertions** | https://playwright.dev/docs/test-assertions | Full list of web-first assertions (`toHaveText`, `toBeVisible`, etc.) |
| **Auto-waiting** | https://playwright.dev/docs/actionability | How Playwright waits before acting — critical to understand |
| **Test hooks** | https://playwright.dev/docs/api/class-test#test-before-each | `beforeEach`, `afterEach`, `beforeAll`, `afterAll` |
| **Best Practices** | https://playwright.dev/docs/best-practices | Recommended patterns and anti-patterns |

### Suggested reading order

1. **Getting Started** — run your first test
2. **Locators** — understand how to find elements
3. **Auto-waiting** — understand *why* you rarely need manual waits
4. **Actions** — learn the interaction API
5. **Assertions** — learn the full assertion API (especially the difference between retrying and non-retrying assertions)
6. **Best Practices** — level up your test quality
