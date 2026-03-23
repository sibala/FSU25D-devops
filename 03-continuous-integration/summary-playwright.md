# Playwright – E2E Testing

End-to-end tests verify the application as a real user would — through a real browser. Playwright opens a browser, navigates to the page, clicks buttons, fills in forms, and checks that the right things appear on screen.

---

## Imports and basic structure

```js
import { test, expect } from "@playwright/test";
```

Each test is an async function that receives a `page` object. `page` represents a browser tab and is what you use to interact with and make assertions about the app.

```js
test("add a todo", async ({ page }) => {
  // test something here
});
```

---

## Grouping tests with `test.describe`

`test.describe` groups related tests under a shared name. It does not affect how tests run, but makes the output easier to read.

```js
test.describe("Blog", () => {
  test("page loads with correct title", async ({ page }) => { ... });
  test("post list is visible", async ({ page }) => { ... });
});
```

---

## Setup with `test.beforeEach`

Runs automatically before every `test()` in the same file or `describe` block. Used to avoid repetition.

```js
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("add a todo", async ({ page }) => {
  // page.goto("/") has already run
  await page.fill("#todo-input", "Buy groceries");
});
```

---

## Navigation

```js
await page.goto("/");          // relative URL, the start page
await page.goto("/about");     // another page
```

Playwright automatically waits for the page to finish loading before moving to the next line.

---

## Interacting with the page

### Fill in a text field

```js
await page.fill("#todo-input", "Buy groceries");
```

`#todo-input` is a CSS selector. `fill` clears the field and types the text.

### Click an element

```js
await page.click('button[type="submit"]');   // CSS attribute selector
await page.click("#clear-btn");              // ID selector
```

### Select an option in a dropdown

```js
await page.selectOption("#tag-filter", "history");
```

The second argument is the `value` attribute of the `<option>` element.

---

## `page.locator()` – the central function

`page.locator()` is the main way to find and interact with elements in Playwright. It takes a CSS selector and returns a **Locator** — an object that represents one or more elements on the page.

```js
page.locator(".todo-item")       // all elements with the class todo-item
page.locator("#tag-filter")      // the element with ID tag-filter
page.locator(".post-card h3")    // h3 inside .post-card
```

A locator does not search the page immediately. The search happens when you call an action (`.click()`, `.fill()`) or an assertion (`expect(locator).toBeVisible()`) on it. This is what allows Playwright to automatically wait for elements to appear.

### Selecting a specific element from a list

```js
page.locator(".todo-item").first()    // the first match
page.locator(".todo-item").nth(0)     // match at index 0 (same as first)
page.locator(".todo-item").nth(2)     // match at index 2 (third element)
```

### Chaining locators

You can search further inside a locator. This reads as: "find `.todo-remove` inside the first `.todo-item`".

```js
page.locator(".todo-item").first().locator(".todo-remove")
```

### Actions on locators

Locators can perform actions directly — no need to go through `page`:

```js
await page.locator(".todo-item").first().locator(".todo-remove").click();
await page.locator(".todo-done").click();
await page.locator("#tag-filter").selectOption("history");  // select a dropdown option
```

---

## Assertions with `expect`

All Playwright assertions are asynchronous and written with `await`. They automatically wait for the condition to be met (up to a timeout) before failing.

### Element is visible

```js
await expect(page.locator(".post-card").first()).toBeVisible();
```

With an extended timeout — used when waiting for real API responses:

```js
await expect(page.locator(".post-card").first()).toBeVisible({ timeout: 10000 });
```

### Exact text

```js
await expect(page.locator(".todo-text")).toHaveText("Buy groceries");
```

### Number of elements

```js
await expect(page.locator(".todo-item")).toHaveCount(3);
await expect(page.locator(".todo-item")).toHaveCount(0);   // no elements remaining
```

### CSS class

Uses a regular expression (regex) to check whether a class is present:

```js
await expect(item).toHaveClass(/done/);        // has the class "done"
await expect(item).not.toHaveClass(/done/);    // does not have the class "done"
```

`not` inverts an assertion — used to verify that something is *not* true.

### Page title

```js
await expect(page).toHaveTitle("My Blog");
```

---

## `await` outside vs `await` inside `expect`

`await` is needed when talking to the browser. Once a value is resolved into memory, no `await` is needed.

```js
await expect(options.first()).toHaveText("Alla")
// toHaveText talks to the browser (polls/retries) — await the whole assertion

expect(await options.count()).toBeGreaterThan(1)
// options.count() talks to the browser — await it to get a number
// toBeGreaterThan just compares two numbers in memory — no await needed
```

---

## Reading values from the page

Sometimes you want to read a value and use it in a regular assertion or loop. In that case, read the value with `await` without `expect`.

### Count elements

```js
let count = await page.locator(".post-card").count();
expect(count).toBeGreaterThan(0);
```

### Get an attribute value

```js
let value = await page.locator("#tag-filter option").nth(1).getAttribute("value");
await page.locator("#tag-filter").selectOption(value);   // use the value in the next step
```

### Get text content from a single element

```js
let info = await page.locator("#post-info").textContent();
expect(info).toContain("posts");
expect(info).toContain("history");
```

### Get text from all matching elements

```js
let texts = await page.locator(".post-meta").allTextContents();
// texts is an array of strings, one per element

for (let text of texts) {
  expect(text).toContain("history");
}
```

---

## Putting it together – complete examples

### Add multiple items using a loop

```js
test("add multiple todos", async ({ page }) => {
  const todos = ["Buy groceries", "Clean", "Exercise"];

  for (const todo of todos) {
    await page.fill("#todo-input", todo);
    await page.click('button[type="submit"]');
  }

  const items = page.locator(".todo-item");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).locator(".todo-text")).toHaveText("Buy groceries");
  await expect(items.nth(1).locator(".todo-text")).toHaveText("Clean");
  await expect(items.nth(2).locator(".todo-text")).toHaveText("Exercise");
});
```

### Remove an item and verify the list

```js
test("remove a todo", async ({ page }) => {
  await page.fill("#todo-input", "Buy groceries");
  await page.click('button[type="submit"]');
  await page.fill("#todo-input", "Clean");
  await page.click('button[type="submit"]');

  await expect(page.locator(".todo-item")).toHaveCount(2);

  await page.locator(".todo-item").first().locator(".todo-remove").click();

  await expect(page.locator(".todo-item")).toHaveCount(1);
  await expect(page.locator(".todo-item").first().locator(".todo-text")).toHaveText("Clean");
});
```

### Toggle a CSS class

```js
test("toggle done on a todo", async ({ page }) => {
  await page.fill("#todo-input", "Buy groceries");
  await page.click('button[type="submit"]');

  const item = page.locator(".todo-item").first();

  await expect(item).not.toHaveClass(/done/);    // starts without done

  await item.locator(".todo-done").click();
  await expect(item).toHaveClass(/done/);        // class is added

  await item.locator(".todo-done").click();
  await expect(item).not.toHaveClass(/done/);    // class is removed
});
```

### Filter and verify all results

```js
test("filtering by tag shows only posts with that tag", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".post-card").first()).toBeVisible();

  // Select a tag from the dropdown
  const tagFilter = page.locator("#tag-filter");
  const secondOption = await tagFilter.locator("option").nth(1).getAttribute("value");
  await tagFilter.selectOption(secondOption);

  // Wait for posts to re-render
  await expect(page.locator(".post-card").first()).toBeVisible();

  // Verify every displayed post contains the selected tag
  const metaTexts = await page.locator(".post-meta").allTextContents();
  for (const meta of metaTexts) {
    expect(meta).toContain(secondOption);
  }
});
```

---

## Quick reference

| What | Syntax |
|------|--------|
| Navigate | `await page.goto("/")` |
| Fill a field | `await page.fill("#id", "text")` |
| Click | `await page.click("selector")` |
| Select dropdown | `await page.selectOption("#id", "value")` |
| Click via locator | `await locator.click()` |
| Select via locator | `await locator.selectOption("value")` |
| First match | `locator.first()` |
| Nth match | `locator.nth(n)` |
| Child element | `locator.locator(".child")` |
| Is visible | `await expect(locator).toBeVisible()` |
| Has text | `await expect(locator).toHaveText("text")` |
| Element count | `await expect(locator).toHaveCount(n)` |
| Has CSS class | `await expect(locator).toHaveClass(/class/)` |
| Missing CSS class | `await expect(locator).not.toHaveClass(/class/)` |
| Page title | `await expect(page).toHaveTitle("title")` |
| Count (as number) | `await locator.count()` |
| Get text | `await locator.textContent()` |
| Get all texts | `await locator.allTextContents()` |
| Get attribute | `await locator.getAttribute("attr")` |
