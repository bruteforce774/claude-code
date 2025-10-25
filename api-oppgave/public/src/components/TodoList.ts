import { BaseComponent } from './BaseComponent';
import type { TodoItem } from '../types';

export class TodoList extends BaseComponent {
    propNames = ['todos'];

    render() {
        const todos = this.get('todos') as TodoItem[] ?? [];

        // Categorize todos into Eisenhower Matrix quadrants
        const doTodos = todos.filter(t => t.urgent && t.important);
        const scheduleTodos = todos.filter(t => !t.urgent && t.important);
        const delegateTodos = todos.filter(t => t.urgent && !t.important);
        const eliminateTodos = todos.filter(t => !t.urgent && !t.important);

        this.shadowRoot!.innerHTML = /*HTML*/`
            <style>
                .matrix-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 20px;
                }
                .quadrant {
                    border: 2px solid #333;
                    border-radius: 8px;
                    padding: 16px;
                    min-height: 150px;
                }
                .quadrant h3 {
                    margin: 0 0 12px 0;
                    padding: 8px;
                    border-radius: 4px;
                    text-align: center;
                }
                .do h3 {
                    background: #f44336;
                    color: white;
                }
                .schedule h3 {
                    background: #4CAF50;
                    color: white;
                }
                .delegate h3 {
                    background: #FF9800;
                    color: white;
                }
                .eliminate h3 {
                    background: #9E9E9E;
                    color: white;
                }
                .quadrant p {
                    font-size: 0.9em;
                    color: #666;
                    margin: 0 0 12px 0;
                    font-style: italic;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                li {
                    padding: 8px;
                    margin-bottom: 8px;
                    background: #f5f5f5;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                li.completed {
                    opacity: 0.6;
                }
                li.completed .todo-text {
                    text-decoration: line-through;
                }
                .todo-text {
                    flex: 1;
                }
                input[type="checkbox"] {
                    cursor: pointer;
                }
                button {
                    padding: 4px 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85em;
                }
                .edit-btn {
                    background: #2196F3;
                    color: white;
                }
                .delete-btn {
                    background: #f44336;
                    color: white;
                }
                .empty {
                    color: #999;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                }
            </style>

            <div class="matrix-container">
                <!-- DO Quadrant -->
                <div class="quadrant do">
                    <h3>DO</h3>
                    <p>Urgent & Important</p>
                    ${this.renderTodoList(doTodos)}
                </div>

                <!-- SCHEDULE Quadrant -->
                <div class="quadrant schedule">
                    <h3>SCHEDULE</h3>
                    <p>Important, Not Urgent</p>
                    ${this.renderTodoList(scheduleTodos)}
                </div>

                <!-- DELEGATE Quadrant -->
                <div class="quadrant delegate">
                    <h3>DELEGATE</h3>
                    <p>Urgent, Not Important</p>
                    ${this.renderTodoList(delegateTodos)}
                </div>

                <!-- ELIMINATE Quadrant -->
                <div class="quadrant eliminate">
                    <h3>ELIMINATE</h3>
                    <p>Neither Urgent nor Important</p>
                    ${this.renderTodoList(eliminateTodos)}
                </div>
            </div>
        `;

        // Attach event listeners after rendering
        this.attachEventListeners();
    }

    renderTodoList(todos: TodoItem[]): string {
        if (todos.length === 0) {
            return '<div class="empty">No tasks in this quadrant</div>';
        }

        return /*HTML*/`
            <ul>
                ${todos.map(todo => /*HTML*/`
                    <li class="${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        <input
                            type="checkbox"
                            ${todo.completed ? 'checked' : ''}
                            data-id="${todo.id}"
                        />
                        <span class="todo-text">${todo.text}</span>
                        <button class="edit-btn" data-id="${todo.id}">Edit</button>
                        <button class="delete-btn" data-id="${todo.id}">Delete</button>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    attachEventListeners() {
        // Toggle complete
        const checkboxes = this.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const id = parseInt(checkbox.dataset.id!);
                this.dispatchEvent(new CustomEvent('toggle-complete', { detail: { id } }));
            });
        });

        // Edit buttons
        const editButtons = this.shadowRoot!.querySelectorAll<HTMLButtonElement>('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id!);
                this.dispatchEvent(new CustomEvent('edit-todo', { detail: { id } }));
            });
        });

        // Delete buttons
        const deleteButtons = this.shadowRoot!.querySelectorAll<HTMLButtonElement>('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id!);
                this.dispatchEvent(new CustomEvent('delete-todo', { detail: { id } }));
            });
        });
    }
}
