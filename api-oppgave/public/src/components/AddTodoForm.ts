import { BaseComponent } from './BaseComponent';
import type { TodoItem } from '../types';

export class AddTodoForm extends BaseComponent {
    private newTodo = {
        text: '',
        urgent: false,
        important: false
    };

    render() {
        this.shadowRoot!.innerHTML = /*HTML*/`
            <style>
                fieldset {
                    border: 2px solid #333;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                }
                legend {
                    font-weight: bold;
                    padding: 0 8px;
                }
                label {
                    display: block;
                    margin-top: 8px;
                    font-weight: 500;
                }
                input[type="text"] {
                    width: 100%;
                    padding: 8px;
                    margin-top: 4px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .checkboxes {
                    display: flex;
                    gap: 16px;
                    margin: 12px 0;
                }
                .checkbox-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                button {
                    padding: 8px 16px;
                    margin-right: 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }
                button:first-of-type {
                    background: #4CAF50;
                    color: white;
                }
                button:last-of-type {
                    background: #f44336;
                    color: white;
                }
            </style>
            <fieldset>
                <legend>Add New Todo</legend>

                <label>Task description</label>
                <input type="text" placeholder="What needs to be done?" />

                <div class="checkboxes">
                    <label class="checkbox-label">
                        <input type="checkbox" id="urgent" />
                        Urgent
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="important" />
                        Important
                    </label>
                </div>

                <button>Add Todo</button>
                <button>Clear</button>
            </fieldset>
        `;

        // Get input elements
        const textInput = this.shadowRoot!.querySelector<HTMLInputElement>('input[type="text"]')!;
        const urgentCheckbox = this.shadowRoot!.querySelector<HTMLInputElement>('#urgent')!;
        const importantCheckbox = this.shadowRoot!.querySelector<HTMLInputElement>('#important')!;

        // Update newTodo object as user types/clicks
        textInput.addEventListener('input', () => this.newTodo.text = textInput.value);
        urgentCheckbox.addEventListener('change', () => this.newTodo.urgent = urgentCheckbox.checked);
        importantCheckbox.addEventListener('change', () => this.newTodo.important = importantCheckbox.checked);

        // Buttons
        const addButton = this.shadowRoot!.querySelector('button')!;
        addButton.addEventListener('click', this.dispatchAddTodo.bind(this));

        const clearButton = this.shadowRoot!.querySelector('button:last-of-type')!;
        clearButton.addEventListener('click', () => {
            this.newTodo = { text: '', urgent: false, important: false };
            this.render();
        });
    }

    dispatchAddTodo() {
        if (!this.newTodo.text.trim()) {
            alert('Please enter a task description!');
            return;
        }

        const event = new CustomEvent('todo-added', {
            detail: this.newTodo
        });
        this.dispatchEvent(event);

        // Clear form after dispatch
        this.newTodo = { text: '', urgent: false, important: false };
        this.render();
    }
}
