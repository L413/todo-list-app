// Local Storage Management Module
const Storage = (() => {
    const STORAGE_KEY = 'todos';

    return {
        getTodos() {
            try {
                const todos = localStorage.getItem(STORAGE_KEY);
                return todos ? JSON.parse(todos) : [];
            } catch (e) {
                console.error('Error reading from storage:', e);
                return [];
            }
        },

        saveTodos(todos) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
                return true;
            } catch (e) {
                console.error('Error saving to storage:', e);
                return false;
            }
        },

        addTodo(text, dueDate = null) {
            const todos = this.getTodos();
            const newTodo = {
                id: Date.now(),
                text,
                dueDate,
                completed: false,
                createdAt: new Date().toISOString()
            };
            todos.push(newTodo);
            this.saveTodos(todos);
            return newTodo;
        },

        deleteTodo(id) {
            const todos = this.getTodos();
            const filtered = todos.filter(todo => todo.id !== id);
            this.saveTodos(filtered);
            return filtered;
        },

        toggleTodo(id) {
            const todos = this.getTodos();
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                this.saveTodos(todos);
            }
            return todos;
        },

        clearCompleted() {
            const todos = this.getTodos();
            const filtered = todos.filter(todo => !todo.completed);
            this.saveTodos(filtered);
            return filtered;
        }
    };
})();
