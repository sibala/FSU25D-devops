# Exercises

## Exercise 02-api-refactored
Starting from `01-api-basic`, refactor `main.js` so that API calls, rendering, and event handling are separated into distinct functions — but still in the same file.

### a)
- Extract the API calls into separate functions: `fetchPosts()`, `fetchTags()`, `fetchPostsByTag(tag)`
- These functions should return the fetch promise
- Mark the section with a comment: `// --- API ---`

### b)
- Extract the DOM rendering into separate functions: `renderPosts(posts)`, `renderTags(tags)`
- `renderPosts` should take an array of posts and render them as post cards
- `renderTags` should take an array of tags and add them as `<option>` elements to the `<select>`
- Mark the section with a comment: `// --- DOM ---`

### c)
- Extract the event handling into a function: `handleTagChange()`
- The function should read the selected tag from the dropdown and fetch the corresponding posts
- If no tag is selected (empty value), fetch all posts
- Show a loading message while fetching
- Mark the section with a comment: `// --- App ---`

### d)
- Wire everything together at the bottom: add the event listener, fetch tags, and fetch initial posts
- Mark the section with a comment: `// --- Starta appen ---`


## Exercise 03-api-modular
Starting from `02-api-refactored`, split the code into separate files using ES modules (`import`/`export`).

### a)
- Move the API functions into `src/api-service.js`
- Add `export` in front of each function: `fetchPosts`, `fetchTags`, `fetchPostsByTag`
- Extract the base URL into a constant: `const BASE_URL = "https://dummyjson.com"`

### b)
- Create `src/app-model.js` with the following exported functions:
  - `setPosts(data)` / `getPosts()`
  - `setTags(data)` / `getTags()`
  - `setSelectedTag(tag)` / `getSelectedTag()`
  - `reset()` — clears all state
- The variables (`posts`, `tags`, `selectedTag`) stay private in the module

### c)
- Move the DOM functions into `src/app-view.js`
- Export: `renderPosts(posts)`, `renderTags(tags, onChange)`, `showLoading()`, `showError(message)`
- `renderTags` should take an `onChange` callback that is called when the user changes the dropdown

### d)
- Update `src/main.js` to import from `api-service.js`, `app-model.js`, and `app-view.js`
- The `handleTagChange` function and the startup code stay in `main.js`

### e)
- Update `index.html` to load `main.js` as a module:
- Replace `<script src="src/main.js"></script>` with `<script type="module" src="src/main.js"></script>`


## Exercise 04-api-tests
Starting from `03-api-modular`, set up a test environment with unit tests, integration tests, and e2e tests.

### a) Setup
- Follow the guide: [Get started with tests](get-started-with-tests.md)

### b) Refactor app-model to a class
- Rewrite `app-model.js` as a class `AppModel` with:
  - A constructor that initializes `posts`, `tags`, and `selectedTag`
  - A `reset()` method that clears all state
- Export the class: `export class AppModel { ... }`
- Update `main.js` to create an instance: `let model = new AppModel()`
- Access state directly: `model.posts = data.posts` instead of `setPosts(data.posts)`

### c) Unit tests
- Create `tests/unit/app-model.test.js`
- Import `describe`, `test`, `expect`, `beforeEach` from `vitest`
- Import `AppModel` from `app-model.js`
- Create a new `AppModel` instance in `beforeEach`
- Write the following tests:
  - `posts` starts as an empty array
  - `tags` starts as an empty array
  - `selectedTag` starts as null
  - Can set and get `posts`
  - `reset()` clears all state (posts, tags, selectedTag)

### d) Integration tests
- Create `tests/integration/app.test.js`
- Mock fetch in `beforeEach`:
```js
vi.stubGlobal("fetch", vi.fn());
fetch.mockResolvedValue({
  ok: true,
  json: async () => ({ Response: "False" }),
});
```
- Set up a fresh DOM in `beforeEach` with `document.body.innerHTML` (include `#tag-filter` and `#post-list`)
- Write the following tests:
  - `fetchPosts` calls the correct URL and returns posts
  - `fetchTags` calls the correct URL and returns tags
  - `fetchPostsByTag` calls the correct URL with the tag slug
  - Full flow: fetch posts → store in model → render in view → verify DOM

### e) E2e tests

> **Tips:** Använd [playwright-cheatsheet.md](playwright-cheatsheet.md) som referens när du skriver testerna!

- Create `tests/e2e/app.e2e.test.js`
- Import `test` and `expect` from `@playwright/test`
- No mocking — tests run against the real DummyJSON API
- Write the following tests:
  - Full flow: page loads, posts are visible, tag dropdown is populated
  - Changing the tag dropdown filters the posts (verify that shown posts contain the selected tag)

### f) Run and verify
- Run `npm test` — all tests (unit, integration, and e2e) should pass
- Run `npm run lint` — no errors should be reported


## Exercise 05-todo-e2e-exercises
Starting from `05-todo-e2e-exercises` — a todo app with unit and integration tests already in place. Your task is to write Playwright e2e tests that test the app in a real browser, without mocking.

> **Tips:** Use [playwright-cheatsheet.md](playwright-cheatsheet.md) as a reference when writing your tests!

Run `npm install`. The project already has `playwright.config.js` and a `test:e2e` script ready — you only need to create the test file

### a) Create the test file
- Create `tests/e2e/app.e2e.test.js`
- Import `test` and `expect` from `@playwright/test`
- Add a `beforeEach` hook that navigates to `"/"`

### b) Test: Add a todo
- Fill in the input field `#todo-input` with a text
- Click the submit button
- Verify that there is 1 `.todo-item` in the list
- Verify that `.todo-text` shows the correct text

### c) Test: Add multiple todos
- Add 3 todos
- Verify that there are 3 `.todo-item` elements in the list
- Verify that each todo has the correct text (use `.nth()`)

### d) Test: Remove a todo
- Add 2 todos
- Click the `.todo-remove` button on the first one
- Verify that only 1 todo remains
- Verify that the correct todo remains

### e) Test: Clear all
- Add 2 todos
- Click `#clear-btn`
- Verify that the list is empty (0 `.todo-item`)

### f) Test: Toggle done
- Add a todo
- Verify that `.todo-item` does not have the class `done`
- Click the `.todo-done` checkbox
- Verify that `.todo-item` has the class `done`
- Click again — verify that the `done` class is removed


Run `npm run test:e2e` — all 5 e2e tests should pass <br>
Run `npm test` — all tests (unit, integration, and e2e) should pass
