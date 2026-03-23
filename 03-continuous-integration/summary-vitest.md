# Vitest – Unit & Integration Testing

All patterns and methods used in projects 04 and 05.

---

## Imports

```js
import { describe, test, expect, beforeEach, vi } from "vitest";
```

---

## Test structure

```js
describe("group name", () => {
  test("description of what is tested", () => {
    // synchronous test
  });

  test("asynchronous test", async () => {
    // asynchronous test
  });
});
```

---

## Setup with `beforeEach`

Runs automatically before every `test()` in the same `describe` block.

```js
beforeEach(() => {
  model = new AppModel();        // create a fresh instance before each test
  resetTodos();                  // reset shared state
  vi.resetModules();             // clear the import cache (required when mocking fetch)
  document.body.innerHTML = `   // reset the DOM
    <div id="app"></div>
  `;
});
```

> **`vi.resetModules()`** ensures that `import()` loads a fresh version of the module every time.
> Always used together with dynamic imports and `vi.stubGlobal`.

---

## `vi.fn()` – mock functions

`vi.fn()` creates a fake function that records every call made to it. You can then control what it returns and assert that it was called.

```js
const callback = vi.fn();

callback("hello");

expect(callback).toHaveBeenCalledWith("hello");  // was it called with this argument?
expect(callback).toHaveBeenCalledTimes(1);       // how many times was it called?
```

Mock functions are also used to stub return values:

```js
const mockFn = vi.fn();
mockFn.mockResolvedValue({ ok: true });   // always resolves with this value
mockFn.mockResolvedValueOnce({ ok: true });  // resolves with this value once
```

---

## Mocking `fetch` with `vi.stubGlobal`

Replaces the global `fetch` function with a fake `vi.fn()`.

```js
vi.stubGlobal("fetch", vi.fn());
```

**Default response** (used unless overridden):

```js
fetch.mockResolvedValue({
  ok: true,
  json: async () => ({ posts: [] }),
});
```

**One-time response** (used once, then falls back to the default):

```js
fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => mockData,
});
```

**Simulate a network error:**

```js
fetch.mockResolvedValueOnce({ ok: false, status: 500 });
```

---

## Dynamic imports

Used together with `vi.resetModules()` so that modules pick up the mocked `fetch`.

```js
const { fetchPosts } = await import("../../src/api-service.js");
const { AppModel } = await import("../../src/app-model.js");
const { renderPosts } = await import("../../src/app-view.js");
```

---

## Assertions – values

```js
expect(value).toBe(42)                        // strict equality (===)
expect(value).toBe(true)                      // boolean
expect(value).toBe(false)
expect(value).toBeNull()                      // is null
expect(value).toEqual([])                     // deep equality (objects/arrays)
expect(value).toEqual({ id: 1, text: "Hi" })
expect(count).toBeGreaterThan(0)              // number is greater than
```

---

## Assertions – arrays

```js
// Array contains at least these elements (order does not matter)
expect(result).toEqual(expect.arrayContaining([{ id: 1 }]))
```

---

## Assertions – function calls

```js
// Exact URL
expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/posts");

// URL that contains a specific string
expect(fetch).toHaveBeenCalledWith(expect.stringContaining("tag=history"));
```

Use `expect.stringContaining` for quick checks when the full URL is unknown or has a changing API key.

---

## Assertions – DOM

```js
const list = document.getElementById("post-list");

expect(list.querySelectorAll(".post-card").length).toBe(2);
expect(list.querySelector("h3").textContent).toBe("First post");
expect(list.querySelector(".post-card:nth-child(2) h3").textContent).toBe("Second post");

expect(li.classList.contains("done")).toBe(false);
expect(li.classList.contains("done")).toBe(true);
```

---

## Async assertions

**Wait for a condition to be met** (e.g. after triggering an event):

```js
await vi.waitFor(() => {
  expect(document.querySelectorAll(".post-card").length).toBeGreaterThan(0);
});
```

**Assert that a promise throws:**

```js
await expect(fetchPosts()).rejects.toThrow("Network error");
```

---

## Simulating DOM events

```js
const dropdown = document.getElementById("tag-filter");
dropdown.value = "history";
dropdown.dispatchEvent(new Event("change"));

// Click
const btn = list.querySelector(".todo-remove");
btn.click();

const checkbox = list.querySelector(".todo-done");
checkbox.click();
```
