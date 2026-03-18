import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, resetTodos, toggleTodo } from "../../src/todo-model.js";

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

describe('toggleTodo', () => {
    beforeEach(() => {
        resetTodos();
    });

    test("sets done to true", () => {
        let todo = addTodo('Köp mjölk');

        toggleTodo(todo.id);
        expect(todo.done).toBe(true);

    });
    
    test("toggles the same todo back to false", () => {
        let todo = addTodo('Köp mjölk');

        toggleTodo(todo.id);
        toggleTodo(todo.id);

        expect(todo.done).toBe(false);
    });

    test("toggleTodo does nothing for non-existent todo", () => {
        let todo = addTodo('Köp mjölk');

        toggleTodo(999);

        expect(todo.done).toBe(false);
    });
})

