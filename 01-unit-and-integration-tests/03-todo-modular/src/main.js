import {addTodo, removeTodo, getTodoCount, resetTodos} from "./todo-model.js"

/**
 * DOM
 */
let list = document.getElementById("todo-list");
let stats = document.getElementById("todo-stats");

function addTodoElement(todo, onRemove) {
  let li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  let span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;

  let btn = document.createElement("button");
  btn.className = "todo-remove";
  btn.textContent = "\u00d7";
  btn.addEventListener("click", () => {
    onRemove(todo.id)
    li.remove();
  });

  li.append(span, btn);
  list.appendChild(li);
}

function updateStats(count) {
  stats.textContent = count + " sysslor";
}


/**
 * 
 * Running the app (Data & DOM)
 */
let form = document.getElementById("todo-form");
let input = document.getElementById("todo-input");
let clearBtn = document.getElementById("clear-btn");
list = document.getElementById("todo-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let text = input.value.trim();
  if (!text) return;

  let todo = addTodo(input.value)
  input.value = "";

  addTodoElement(todo, () => { 
    removeTodo(todo.id);
    updateStats(getTodoCount())
  })

  updateStats(getTodoCount())
});

clearBtn.addEventListener("click", () => {
  resetTodos()
  list.innerHTML = "";
  updateStats(getTodoCount());
});
