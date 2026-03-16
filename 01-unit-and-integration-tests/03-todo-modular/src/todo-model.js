let todos = [];
let nextId = 1;

export function addTodo(text) {
  let trimmedText = text.trim();
  if (!trimmedText) return;

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
