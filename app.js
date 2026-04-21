// Main App Module
const App = (() => {
    return {
        init() {
            const todos = Storage.getTodos();
            UI.render(todos);
            UI.focusInput();

            UI.initEventListeners({
                onAdd: (text, dueDate) => this.addTodo(text, dueDate),
                onToggle: (id) => this.toggleTodo(id),
                onDelete: (id) => this.deleteTodo(id),
                onClear: () => this.clearCompleted()
            });
        },

        addTodo(text, dueDate) {
            Storage.addTodo(text, dueDate);
            const todos = Storage.getTodos();
            UI.render(todos);
        },

        toggleTodo(id) {
            Storage.toggleTodo(id);
            const todos = Storage.getTodos();
            UI.render(todos);
        },

        deleteTodo(id) {
            Storage.deleteTodo(id);
            const todos = Storage.getTodos();
            UI.render(todos);
        },

        clearCompleted() {
            Storage.clearCompleted();
            const todos = Storage.getTodos();
            UI.render(todos);
        }
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
