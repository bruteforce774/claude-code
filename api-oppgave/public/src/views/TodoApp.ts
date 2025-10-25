import { BaseComponent } from '../components/BaseComponent';
import type { AppState, TodoItem } from '../types';
import * as api from '../api';

export class TodoApp extends BaseComponent {
    private state: AppState = {
        todos: []
    };

    // Load todos from API when component mounts
    async connectedCallback() {
        await this.loadTodos();
        super.connectedCallback(); // Call render
    }

    async loadTodos() {
        try {
            this.state.todos = await api.getTodos();
            this.render();
        } catch (error) {
            console.error('Failed to load todos:', error);
            alert('Failed to load todos. Please refresh the page.');
        }
    }

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
    // EVENT HANDLERS - Connected to API
    // ============================================

    async handleAddTodo(e: Event) {
        const customEvent = e as CustomEvent;
        const { text, urgent, important } = customEvent.detail;

        try {
            // Call API to create todo - server provides the ID
            const newTodo = await api.createTodo({ text, urgent, important });
            this.state.todos.push(newTodo);
            this.render();
        } catch (error) {
            console.error('Failed to add todo:', error);
            alert('Failed to add todo. Please try again.');
        }
    }

    async handleToggleComplete(e: Event) {
        const customEvent = e as CustomEvent;
        const { id } = customEvent.detail;

        const todo = this.state.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            // Call API to update the completed status
            const updatedTodo = await api.updateTodo(id, {
                completed: !todo.completed
            });

            // Update local state with server response
            const index = this.state.todos.findIndex(t => t.id === id);
            this.state.todos[index] = updatedTodo;
            this.render();
        } catch (error) {
            console.error('Failed to toggle todo:', error);
            alert('Failed to update todo. Please try again.');
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

        try {
            // Call API to update todo
            const updatedTodo = await api.updateTodo(id, {
                text: newText.trim() || todo.text,
                urgent: newUrgent,
                important: newImportant
            });

            // Update local state with server response
            const index = this.state.todos.findIndex(t => t.id === id);
            this.state.todos[index] = updatedTodo;
            this.render();
        } catch (error) {
            console.error('Failed to edit todo:', error);
            alert('Failed to update todo. Please try again.');
        }
    }

    async handleDeleteTodo(e: Event) {
        const customEvent = e as CustomEvent;
        const { id } = customEvent.detail;

        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            // Call API to delete todo
            await api.deleteTodo(id);

            // Remove from local state
            this.state.todos = this.state.todos.filter(t => t.id !== id);
            this.render();
        } catch (error) {
            console.error('Failed to delete todo:', error);
            alert('Failed to delete todo. Please try again.');
        }
    }
}
