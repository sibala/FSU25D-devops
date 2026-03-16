import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos } from "../../src/todo-model.js";


describe("todo-model", () => {
    beforeEach(() => {
        resetTodos();
    });

   test("addTodo returns a todo with correct id and text", () => {
        let todo = addTodo("Buy milk");
        expect(todo.id).toBe(1);
        expect(todo.text).toBe("Buy milk");
        expect(todo.done).toBe(false);
    });

    test("addTodo returns null for empty string", () => {
        expect(addTodo("")).toBeNull();
    });

});
