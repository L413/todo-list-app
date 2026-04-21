// UI Management Module
const UI = (() => {
    const todoList = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addBtn = document.getElementById('addBtn');
    const clearBtn = document.getElementById('clearBtn');
    const taskCount = document.getElementById('taskCount');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    return {
        render(todos) {
            todoList.innerHTML = '';

            const filtered = this.filterTodos(todos);

            if (filtered.length === 0) {
                todoList.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one to get started!</p></div>';
            } else {
                filtered.forEach(todo => {
                    const item = this.createTodoElement(todo);
                    todoList.appendChild(item);
                });
            }

            this.updateTaskCount(todos);
            this.updateClearButton(todos);
        },

        createTodoElement(todo) {
            const item = document.createElement('div');
            item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            item.dataset.id = todo.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.checked = todo.completed;

            const content = document.createElement('div');
            content.className = 'todo-content';

            const text = document.createElement('span');
            text.className = 'todo-text';
            text.textContent = todo.text;

            content.appendChild(text);

            if (todo.dueDate) {
                const date = document.createElement('span');
                date.className = 'todo-date';
                date.textContent = this.formatDate(todo.dueDate);
                content.appendChild(date);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';

            item.appendChild(checkbox);
            item.appendChild(content);
            item.appendChild(deleteBtn);

            return item;
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const formatTime = (d) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            if (date.toDateString() === today.toDateString()) {
                return `Today at ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return `Tomorrow at ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            }

            return formatTime(date);
        },

        filterTodos(todos) {
            switch (currentFilter) {
                case 'active':
                    return todos.filter(t => !t.completed);
                case 'completed':
                    return todos.filter(t => t.completed);
                default:
                    return todos;
            }
        },

        updateTaskCount(todos) {
            const activeTasks = todos.filter(t => !t.completed).length;
            taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'}`;
        },

        updateClearButton(todos) {
            const hasCompleted = todos.some(t => t.completed);
            clearBtn.disabled = !hasCompleted;
        },

        getInputValue() {
            return todoInput.value.trim();
        },

        getDueDate() {
            return dueDateInput.value || null;
        },

        clearInputs() {
            todoInput.value = '';
            dueDateInput.value = '';
        },

        focusInput() {
            todoInput.focus();
        },

        setFilter(filter) {
            currentFilter = filter;
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
        },

        initEventListeners(callbacks) {
            addBtn.addEventListener('click', () => {
                const text = this.getInputValue();
                const dueDate = this.getDueDate();
                if (text) {
                    callbacks.onAdd(text, dueDate);
                    this.clearInputs();
                    this.focusInput();
                }
            });

            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addBtn.click();
                }
            });

            clearBtn.addEventListener('click', () => {
                callbacks.onClear();
            });

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setFilter(btn.dataset.filter);
                    const todos = Storage.getTodos();
                    this.render(todos);
                });
            });

            todoList.addEventListener('change', (e) => {
                if (e.target.classList.contains('checkbox')) {
                    const id = parseInt(e.target.closest('.todo-item').dataset.id);
                    callbacks.onToggle(id);
                }
            });

            todoList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    const id = parseInt(e.target.closest('.todo-item').dataset.id);
                    callbacks.onDelete(id);
                }
            });
        }
    };
})();
