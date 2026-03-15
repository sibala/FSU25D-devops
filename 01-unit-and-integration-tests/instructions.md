# Instructions

## 1. Install NodeJS
- [Download and install NodeJS](https://nodejs.org/en/download)


## 2. Initialize project and install dependencies

Flag descriptions:
- `-y` answers yes to all follow-up questions
- `-D` installs the package in devDependencies. These packages are only used in the development/test environment

| Command | Description |
|---------|-------------|
| `npm init -y` | Initializes a new project. Creates a `package.json` file |
| `npm install -D vitest jsdom eslint` | Installs all dev dependencies in one command |

Package descriptions:
- **vitest** — Test framework for running unit and integration tests. https://www.npmjs.com/package/vitest
- **jsdom** — Fake browser DOM so integration tests can run in Node. https://www.npmjs.com/package/jsdom
- **eslint** — Linter that catches code errors and enforces code quality. https://www.npmjs.com/package/eslint


## 3. Configure Vitest
- Create a `vitest.config.js` file in the project root:
```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
  },
});
```
- Add test script to `package.json`:
```json
"scripts": {
  "test": "vitest run"
}
```


## 4. Configure ESLint
- `npx eslint --init` — Creates an ESLint config file through a setup wizard
- Add lint script to `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "lint": "eslint src/"
}
```


## 5. Project structure
```
project/
├── src/
│   ├── todo-model.js       ← Pure logic (no DOM)
│   ├── todo-view.js        ← DOM manipulation
│   └── main.js             ← Wires model and view together
├── tests/
│   ├── unit/
│   │   └── todo-model.test.js
│   └── integration/
│       └── app.test.js
├── index.html
├── eslint.config.mjs
├── vitest.config.js
└── package.json
```


## 6. Writing unit tests
- Unit tests test **pure logic** — no DOM, no browser
- Import functions from `src/` and call them directly
- Use `beforeEach` to reset state between tests
- Example:
```js
import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos } from "../../src/todo-model.js";

describe("todo-model", () => {
  beforeEach(() => {
    resetTodos();
  });

  test("addTodo returns a todo with correct id and text", () => {
    let todo = addTodo("Buy milk");
    expect(todo.id).toBe(1);
    expect(todo.text).toBe("Buy milk");
    expect(todo.done).toBe(false);
  });

  test("addTodo returns null for empty string", () => {
    expect(addTodo("")).toBeNull();
  });
});
```


## 7. Writing integration tests
- Integration tests test **model + view + DOM together**
- Uses jsdom to simulate a browser environment
- Set up a minimal DOM and reset data in `beforeEach`:
```js
import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos } from "../../src/todo-model.js";
import { addTodoElement, updateStats, clearList } from "../../src/todo-view.js";

describe("app integration", () => {
  beforeEach(() => {
    resetTodos();
    document.body.innerHTML = `
      <form id="todo-form">
        <input type="text" id="todo-input" />
        <button type="submit">Lägg till</button>
        <button type="button" id="clear-btn">Rensa alla</button>
      </form>
      <ul id="todo-list"></ul>
      <p id="todo-stats">0 sysslor</p>
    `;
  });

  function addTodoToDOM(text) {
    let todo = addTodo(text);
    if (!todo) return null;
    addTodoElement(todo, (id) => {
      removeTodo(id);
      updateStats(getTodoCount());
    });
    updateStats(getTodoCount());
    return todo;
  }

  test("adding a todo shows it in the list", () => {
    addTodoToDOM("Buy milk");

    let list = document.getElementById("todo-list");
    expect(list.children.length).toBe(1);
    expect(list.children[0].querySelector(".todo-text").textContent).toBe("Buy milk");
  });
});
```


## 8. Running tests and linting
- `npm test` — Run all tests (`npm test` is a built-in shorthand for `npm run test`)
- `npm run lint` — Lint source files


## Reading
- [Vitest — Getting Started](https://vitest.dev/guide/)
- [Vitest — API Reference](https://vitest.dev/api/)
- [Vitest — expect](https://vitest.dev/api/expect.html)
- [Vitest — Test Environment (jsdom)](https://vitest.dev/guide/environment.html)
- [ESLint — Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [ESLint — Configuring Rules](https://eslint.org/docs/latest/use/configure/rules)
- [MDN — module.exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
