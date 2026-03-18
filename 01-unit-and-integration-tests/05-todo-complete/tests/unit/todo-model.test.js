import { describe, test, expect, beforeEach } from "vitest";
import { addTodo, removeTodo, getTodoCount, resetTodos, getTodos, toggleTodo } from "../../src/todo-model.js";

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

    test("addTodo trims whitespace from the text", () => {
        let todo = addTodo("   Buy milk   ");
        expect(todo.text).toBe("Buy milk");
    })

    test("getTodoCount returns the correct count after adding/removing", () => {
        let todoA = addTodo("A");
        let todoB = addTodo("B");
        expect(getTodoCount()).toBe(2)
        
        removeTodo(todoA.id)
        expect(getTodoCount()).toBe(1)
    })

    test("resetTodos clears all todos", () => {
        addTodo("A");
        addTodo("B");
        
        resetTodos();
        expect(getTodoCount()).toBe(0)
    })
    
    test("removeTodo removes the correct todo", () => {
        let todoA = addTodo("A");
        let todoB = addTodo("B");
        expect(getTodoCount()).toBe(2)
        
        removeTodo(todoA.id)
        expect(getTodoCount()).toBe(1)
        expect(getTodos()[0].text).toBe("B")
    })

    test("toggleTodo sets done to true", () => {
        let todo = addTodo("A");
        // expect(todo.done).toBeFalsy()
        expect(todo.done).toBe(false)
        toggleTodo(todo.id)
        expect(todo.done).toBe(true)
    })


    test("toggleTodo on the same todo again sets done back to false", () => {
        let todo = addTodo("A");
        expect(todo.done).toBe(false)

        toggleTodo(todo.id)
        expect(todo.done).toBe(true)

        toggleTodo(todo.id)
        expect(todo.done).toBe(false)
    })

    test("toggleTodo with an invalid id does nothing", () => {
        expect(toggleTodo(0)).toBeNull()
    })
});
