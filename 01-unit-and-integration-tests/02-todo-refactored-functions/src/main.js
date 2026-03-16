

/**
 * 
 * Data logic
 */
let todos = [];
let nextId = 1;


function addTodo(text) {
  let trimmedText = text.trim();
  if (!trimmedText) return;

  let id = nextId++;
  let todo = { id: id, text: trimmedText, done: false }
  todos.push(todo);
  return todo;
}


/**
 * DOM
 */
let form = document.getElementById("todo-form");
let input = document.getElementById("todo-input");
let list = document.getElementById("todo-list");
let stats = document.getElementById("todo-stats");
let clearBtn = document.getElementById("clear-btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // let text = input.value.trim();
  // if (!text) return;

  // let id = nextId++;
  // todos.push({ id: id, text: text, done: false });
  // console.log(todos);

  let todo = addTodo(input.value)
  console.log(todo)
  
  input.value = "";
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
    todos = todos.filter(t => t.id !== id);
    li.remove();
    stats.textContent = todos.length + " sysslor";
  });

  li.append(span, btn);
  list.appendChild(li);
  stats.textContent = todos.length + " sysslor";
});



/**
 * 
 * Running the app (Data & DOM)
 */

clearBtn.addEventListener("click", () => {
  todos = [];
  nextId = 1;
  list.innerHTML = "";
  stats.textContent = "0 sysslor";
});
