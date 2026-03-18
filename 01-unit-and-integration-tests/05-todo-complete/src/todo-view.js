let list = document.getElementById("todo-list");
let stats = document.getElementById("todo-stats");

export function addTodoElement(todo, onRemove, onToggle) {
  let li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox"
  checkbox.addEventListener('click', (e) => {
    onToggle(todo.id)
    e.target.parentNode.classList.toggle('done')
  })

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

  li.append(checkbox, span, btn);
  list.appendChild(li);
}

export function updateStats(count) {
  stats.textContent = count + " sysslor";
}

export function clearList() {
  list.innerHTML = "";
}