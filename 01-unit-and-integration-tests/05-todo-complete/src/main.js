import {addTodo, removeTodo, getTodoCount, resetTodos, toggleTodo} from "./todo-model.js"
import {addTodoElement, updateStats, clearList} from "./todo-view.js"

let form = document.getElementById("todo-form");
let input = document.getElementById("todo-input");
let clearBtn = document.getElementById("clear-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let text = input.value.trim();
  if (!text) return;

  let todo = addTodo(input.value)
  input.value = "";

  addTodoElement(
    todo, 
    () => {
      removeTodo;
      updateStats(getTodoCount());
    },
    toggleTodo
  )

  updateStats(getTodoCount())
});

clearBtn.addEventListener("click", () => {
  resetTodos()
  clearList()
  updateStats(getTodoCount())
});
