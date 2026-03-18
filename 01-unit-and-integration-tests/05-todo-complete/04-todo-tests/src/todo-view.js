export function addTodoElement(todo, onToggle, onRemove) {
  let list = document.getElementById("todo-list");

  let li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  if (todo.done) {
    li.classList.add("done");
  }

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;

  checkbox.addEventListener("click", () => {
    onToggle(todo.id);
    li.classList.toggle("done");
  });

  let span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;

  let button = document.createElement("button");
  button.className = "todo-remove";
  button.textContent = "x";

  button.addEventListener("click", () => {
    onRemove();
    li.remove();
  });

  li.append(checkbox, span, button);
  list.appendChild(li);
}

export function updateStats(count) {
  let stats = document.getElementById("todo-stats");
  stats.textContent = count + " sysslor";
}

export function clearList() {
  let list = document.getElementById("todo-list");
  list.innerHTML = "";
}