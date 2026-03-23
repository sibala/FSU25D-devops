# Get Started With Tests

## 1. Install NodeJS
- [Download and install NodeJS](https://nodejs.org/en/download)


## 2. Initialize project and install dependencies

Flag descriptions:
- `-y` answers yes to all follow-up questions
- `-D` installs the package in devDependencies. These packages are only used in the development/test environment

| Command | Description |
|---------|-------------|
| `npm init -y` | Initializes a new project. Creates a `package.json` file |
| `npm install -D vitest jsdom eslint @eslint/js globals` | Installs Vitest, jsdom, and ESLint |
| `npm install -D @playwright/test` | Installs Playwright for e2e tests |
| `npm install -D vite` | Installs Vite for building and previewing the app |
| `npx playwright install chromium` | Downloads the Chromium browser for Playwright |
| `npm i -D @vitest/coverage-v8` | Install Vitestcode coverage |


Package descriptions:
- **vitest** — Test framework for running unit and integration tests. https://www.npmjs.com/package/vitest
- **jsdom** — Fake browser DOM so integration tests can run in Node. https://www.npmjs.com/package/jsdom
- **eslint** — Linter that catches code errors and enforces code quality. https://www.npmjs.com/package/eslint
- **@playwright/test** — E2e test framework that runs tests in a real browser. https://www.npmjs.com/package/@playwright/test
- **vite** — Build tool that bundles the app for production and serves it locally. https://www.npmjs.com/package/vite


## 3. Configure `package.json`
Add scripts:
```json
"scripts": {
  "test": "vitest run --coverage && npm run test:e2e",
  "test:e2e": "vite build && npx playwright test",
  "lint": "eslint src/",
  "preview": "vite preview"
}
```

Script descriptions:
- `npm test` — Runs tests (unit + integration)
- `npm run test:e2e` — Builds the app and runs e2e tests with Playwright 
- `npm run lint` — Lints source files with ESLint
- `npm run preview` — Serves the built app locally (used by Playwright)


## 4. Configure Vitest
- Create a `vitest.config.js` file in the project root:
```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
    exclude: ["tests/e2e/**"],
  },
});
```

- `environment: "jsdom"` — simulates a browser DOM in Node
- `include` — which test files Vitest should run
- `exclude` — skip e2e tests (Playwright handles those)


## 5. Configure Playwright
- Create a `playwright.config.js` file in the project root:
```js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:4173",
  },
});
```

- `testDir` — where Playwright looks for test files
- `webServer` — starts `vite preview` automatically before running tests
- `reuseExistingServer` — reuses an already running server locally, but starts a fresh one in CI


## 6. Configure ESLint
- `npx eslint --init` — Creates an ESLint config file through a setup wizard
- Or create `eslint.config.mjs` manually:
```js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
]);
```


## 7. Project structure
```
project/
├── src/
│   ├── api-service.js      ← API calls (fetch)
│   ├── app-model.js        ← Data/state (class)
│   ├── app-view.js         ← DOM manipulation
│   ├── main.js             ← Wires everything together
│   └── css/
│       └── style.css
├── tests/
│   ├── unit/
│   │   └── app-model.test.js
│   ├── integration/
│   │   └── app.test.js
│   └── e2e/
│       └── app.e2e.test.js
├── index.html
├── eslint.config.mjs
├── vitest.config.js
├── playwright.config.js
└── package.json
```


## 8. Writing unit tests
- Unit tests test **pure logic** — no DOM, no fetch, no browser
- Import the class/functions from `src/` and test them directly
- Use `beforeEach` to create a fresh instance between tests
- Example:
```js
import { describe, test, expect, beforeEach } from "vitest";
import { AppModel } from "../../src/app-model.js";

describe("app-model", () => {
  let model;

  beforeEach(() => {
    model = new AppModel();
  });

  test("posts starts as empty array", () => {
    expect(model.posts).toEqual([]);
  });

  test("reset clears all state", () => {
    model.posts = [{ id: 1, title: "Hej" }];
    model.selectedTag = "history";
    model.reset();
    expect(model.posts).toEqual([]);
    expect(model.selectedTag).toBeNull();
  });
});
```


## 9. Writing integration tests
- Integration tests test **API service + model + view + DOM together**
- Uses jsdom to simulate a browser environment
- Mock `fetch` with `vi.stubGlobal` so tests don't call the real API
- Set up a minimal DOM in `beforeEach`:
```js
import { describe, test, expect, beforeEach, vi } from "vitest";

describe("app integration", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ Response: "False" }),
    });
    document.body.innerHTML = `
      <main class="container">
        <h1>Inlägg</h1>
        <select id="tag-filter"><option value="">Alla</option></select>
        <div id="post-list"></div>
      </main>
    `;
  });

  test("fetchPosts returns posts from API", async () => {
    let postData = { posts: [{ id: 1, title: "Test" }] };
    fetch.mockResolvedValueOnce({ ok: true, json: async () => postData });

    const { fetchPosts } = await import("../../src/api-service.js");
    let result = await fetchPosts();

    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/posts");
    expect(result).toEqual(postData);
  });
});
```

Key concepts:
- `vi.stubGlobal("fetch", vi.fn())` — replaces the global `fetch` with a mock function
- `fetch.mockResolvedValue(...)` — sets a default response for all fetch calls
- `fetch.mockResolvedValueOnce(...)` — sets a response for the next fetch call only
- `vi.resetModules()` — clears module cache so each test gets fresh imports


## 10. Writing e2e tests
- E2e tests test the **full app in a real browser** against the real API
- Playwright opens the app in Chromium and interacts with it like a user
- No mocking — tests verify that the real API integration works
- Example:
```js
import { test, expect } from "@playwright/test";

test("full flow: load posts and tags on start", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".post-card").first()).toBeVisible();
  await expect(page.locator(".post-card")).not.toHaveCount(0);

  let options = page.locator("#tag-filter option");
  await expect(options.first()).toHaveText("Alla");
  expect(await options.count()).toBeGreaterThan(1);
});
```

Key concepts:
- `page.goto("/")` — navigates to the app
- `page.locator(...)` — finds elements on the page (like `document.querySelector`)
- `await expect(...).toBeVisible()` — waits for the element to appear (auto-retry)
- `page.selectOption(...)` — selects an option in a `<select>` dropdown


## 11. Running tests and linting
| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (unit + integration + e2e) |
| `npm run test:e2e` | Run only e2e tests |
| `npm run lint` | Lint source files |


## Reading
- [Vitest — Getting Started](https://vitest.dev/guide/)
- [Vitest — API Reference](https://vitest.dev/api/)
- [Vitest — expect](https://vitest.dev/api/expect.html)
- [Vitest — Mocking](https://vitest.dev/guide/mocking.html)
- [Vitest — Test Environment (jsdom)](https://vitest.dev/guide/environment.html)
- [Playwright — Getting Started](https://playwright.dev/docs/intro)
- [Playwright — Locators](https://playwright.dev/docs/locators)
- [Playwright — Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright — Web Server](https://playwright.dev/docs/test-webserver)
- [ESLint — Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [DummyJSON — Posts API](https://dummyjson.com/docs/posts)
- [MDN — ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN — async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
