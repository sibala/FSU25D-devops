import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, resetTodos, toggleTodo, getTodos, getTodoCount } from "../../src/todo-model.js";
import { addTodoElement, updateStats, clearList} from "../../src/todo-view.js";


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

  test("adding a todo shows it in the list", () => {
    let todo = addTodo('Köp mjölk');
    addTodoElement(todo, () => {}, () => {})
    let todo2 = addTodo('Köp vete');
    addTodoElement(todo2, () => {}, () => {})

    let list = document.getElementById('todo-list')
    expect(list.children.length).toBe(2);
    expect(list.children[0].querySelector('.todo-text').textContent).toBe("Köp mjölk");
    expect(list.children[1].querySelector('.todo-text').textContent).toBe("Köp vete");
  })
});

test("clicking the checkbox toggles the done class on the list item", () => {
  let todo = addTodo("Köp mjölk");

  addTodoElement(
    todo,
    (id) => {
      toggleTodo(id);
    },
    () => {}
  );

  let list = document.getElementById("todo-list");
  let item = list.children[0];
  let checkbox = item.querySelector('input[type="checkbox"]');

  expect(item.classList.contains("done")).toBe(false);

  checkbox.click();
  expect(item.classList.contains("done")).toBe(true);

  checkbox.click();
  expect(item.classList.contains("done")).toBe(false);
});

test("returns a todo with correct id, text, and done:false", () => {
    let todo = addTodo('Köp mjölk');
    expect(todo.id).toBe(1);
    expect(todo.text).toBe("Köp mjölk");
    expect(todo.done).toBe(false);
  })

  test('trims whitespace from the text', () => {
    let todo = addTodo('   Köp mjölk   ');
    expect(todo.text).toBe("Köp mjölk");
  })

  test('returns null for empty string', () => {
    expect(addTodo("")).toBeNull();
  })

  test('removes the correct todo', () => {
    let todoA = addTodo('Köp mjölk');
    let todoB = addTodo('Köp vete');
    expect(getTodoCount()).toBe(2)

      removeEventListener(todoA.id)
      expect(getTodoCount()).toBe(1);
      expect(getTodos()[0].text).toBe(todoB);
    })

  test('removes the correct todo', () => {
    let todo = addTodo('Köp mjölk');
    removeTodo(todo.id);
    expect(getTodos()).not.toContain(todo);
  })

  test('returns the correct count after adding/removing', () => {
    addTodo('Köp mjölk');
    addTodo('Köp vete');
    expect(getTodoCount()).toBe(2);
    removeTodo(1);
    expect(getTodoCount()).toBe(1);
  })

  test('adding/returns the correct count after adding/removing', () => {
    let todoA = addTodo('A');
    let todoB = addTodo('B');
    expect(getTodoCount()).toBe(2);

    removeTodo(todoA.id)
    expect(getTodoCount()).toBe(1)
  })

  test('resetTodos clears all todos', () => {
    addTodo('Köp mjölk');
    addTodo('Köp vete');
    resetTodos();
    expect(getTodoCount()).toBe(0);
  })
