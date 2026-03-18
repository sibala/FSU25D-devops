let todos = [];
let nextId = 1;

export function addTodo(text) {
  let trimmedText = text.trim();
  if (!trimmedText) return null;

  let id = nextId++;
  let todo = { id: id, text: trimmedText, done: false }
  todos.push(todo);
  return todo;
}

export function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
}

export function getTodoCount() {
  return todos.length
}

export function resetTodos() {
  todos = [];
  nextId = 1;
}

export function toggleTodo(id) {
  let todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
}
