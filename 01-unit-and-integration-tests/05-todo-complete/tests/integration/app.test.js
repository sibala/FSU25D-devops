import { describe, test, expect, beforeEach, vi } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos, toggleTodo } from "../../src/todo-model.js";
// import { addTodoElement, updateStats, clearList} from "../../src/todo-view.js";


describe("app integration", () => {
  beforeEach(() => {
    vi.resetModules() // resets the import cache, enabling fresh imports every time
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

  test("adding a todo shows it in the list", async () => {
    const { addTodoElement } = await import("../../src/todo-view.js");
    let todo = addTodo('Köp mjölk');
    addTodoElement(todo, () => {})
    let todo2 = addTodo('Köp vete');
    addTodoElement(todo2, () => {})

    let list = document.getElementById('todo-list')
    expect(list.children.length).toBe(2);
    expect(list.children[0].querySelector('.todo-text').textContent).toBe("Köp mjölk");
    expect(list.children[1].querySelector('.todo-text').textContent).toBe("Köp vete");
  })

  test("Clicking the remove button removes the todo from the list and from the data", async () => {
    const { addTodoElement, updateStats } = await import("../../src/todo-view.js");
    let todo = addTodo('Köp mjölk');
    addTodoElement(todo, () => { 
      removeTodo(todo.id);
      updateStats(getTodoCount())
    })

    let list = document.getElementById('todo-list')
    expect(list.children.length).toBe(1)

    let removeBtn = list.children[0].querySelector(".todo-remove");
    removeBtn.click();

    expect(list.children.length).toBe(0);
    expect(getTodoCount()).toBe(0);
  })

  test("Clearing removes all todos from both the list and the data", async () => {
    const { addTodoElement, updateStats, clearList } = await import("../../src/todo-view.js");
    let todo = addTodo('Köp mjölk');
    addTodoElement(todo, () => {})
    let todo2 = addTodo('Köp vete');
    addTodoElement(todo2, () => {})

    let list = document.getElementById('todo-list')
    expect(list.children.length).toBe(2)

    resetTodos()
    clearList()
    updateStats(getTodoCount())

    expect(list.children.length).toBe(0)
  })


  test("Clicking the checkbox toggles the done class on the list item", async () => {
    const { addTodoElement, updateStats, clearList } = await import("../../src/todo-view.js");
    
    let todo = addTodo('Köp mjölk');
    addTodoElement(
      todo, 
      () => {}, 
      toggleTodo
    )

    let list = document.getElementById('todo-list')
    let li = list.children[0];
    expect(list.children.length).toBe(1)
    expect(li.classList.contains('done')).toBe(false);
    
    let checkbox = list.children[0].querySelector('.todo-done')
    checkbox.click();
    expect(li.classList.contains('done')).toBe(true);

    checkbox.click();
    expect(li.classList.contains('done')).toBe(false);
  })
});