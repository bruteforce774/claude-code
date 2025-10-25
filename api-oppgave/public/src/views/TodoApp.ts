import { BaseComponent } from '../components/BaseComponent';
import type { AppState, TodoItem } from '../types';

export class TodoApp extends BaseComponent {
    private state: AppState = {
        todos: []
    };

    render() {
        this.shadowRoot!.innerHTML = /*HTML*/`
            <style>
                :host {
                    display: block;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }
                .subtitle {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                    font-style: italic;
                }
            </style>

            <h1>📋 Eisenhower Matrix Todo App</h1>
            <p class="subtitle">Organize your tasks by urgency and importance</p>

            <add-todo-form></add-todo-form>
            <todo-list></todo-list>
        `;

        // Get child components
        const form = this.shadowRoot!.querySelector('add-todo-form');
        const list = this.shadowRoot!.querySelector('todo-list') as BaseComponent;

        // Listen to form events
        form?.addEventListener('todo-added', this.handleAddTodo.bind(this));

        // Listen to list events
        list?.addEventListener('toggle-complete', this.handleToggleComplete.bind(this));
        list?.addEventListener('edit-todo', this.handleEditTodo.bind(this));
        list?.addEventListener('delete-todo', this.handleDeleteTodo.bind(this));

        // Pass todos to list
        if (list) {
            list.set('todos', this.state.todos);
            list.render();
        }
    }

    // ============================================
    // EVENT HANDLERS (will connect to API later)
    // ============================================

    async handleAddTodo(e: Event) {
        const customEvent = e as CustomEvent;
        const { text, urgent, important } = customEvent.detail;

        // TODO: Call API to create todo
        // For now, just add to local state
        const newTodo: TodoItem = {
            id: Date.now(), // Temporary ID (API will provide real one)
            text,
            completed: false,
            urgent,
            important
        };

        this.state.todos.push(newTodo);
        this.render();
    }

    async handleToggleComplete(e: Event) {
        const customEvent = e as CustomEvent;
        const { id } = customEvent.detail;

        // TODO: Call API to update todo
        // For now, update local state
        const todo = this.state.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.render();
        }
    }

    async handleEditTodo(e: Event) {
        const customEvent = e as CustomEvent;
        const { id } = customEvent.detail;

        const todo = this.state.todos.find(t => t.id === id);
        if (!todo) return;

        // Simple prompt for now (could make a fancy modal later)
        const newText = prompt('Edit task:', todo.text);
        if (newText === null) return; // User cancelled

        const newUrgent = confirm('Is this task urgent?');
        const newImportant = confirm('Is this task important?');

        // TODO: Call API to update todo
        // For now, update local state
        todo.text = newText.trim() || todo.text;
        todo.urgent = newUrgent;
        todo.important = newImportant;
        this.render();
    }

    async handleDeleteTodo(e: Event) {
        const customEvent = e as CustomEvent;
        const { id } = customEvent.detail;

        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        // TODO: Call API to delete todo
        // For now, remove from local state
        this.state.todos = this.state.todos.filter(t => t.id !== id);
        this.render();
    }
}
