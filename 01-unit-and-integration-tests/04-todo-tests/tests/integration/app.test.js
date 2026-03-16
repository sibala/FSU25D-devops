import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos } from "../../src/todo-model.js";
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
    addTodoElement(todo, () => {})
    let todo2 = addTodo('Köp vete');
    addTodoElement(todo2, () => {})

    let list = document.getElementById('todo-list')
    expect(list.children.length).toBe(2);
    expect(list.children[0].querySelector('.todo-text').textContent).toBe("Köp mjölk");
    expect(list.children[1].querySelector('.todo-text').textContent).toBe("Köp vete");
  })
});