import { BaseComponent } from './BaseComponent';
import type { Item } from '../types';

export class AddNewForm extends BaseComponent {
    private readonly newObj: Item = {
            count: 0,
            description: ''
        };
    propNames = ['title'];

    render() {
        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset>
                <legend>${this.title}</legend>
                <label>Antall</label><br/>
                <input type="number"/><br/>
                <label>Vare</label><br/>
                <input type="text"/><br/>
                <button>Legg til</button>
                <button>Nullstill</button>
            </fieldset>
        `;

        const countInput = this.shadowRoot!.querySelector<HTMLInputElement>('input[type="number"]')!;
        const itemInput = this.shadowRoot!.querySelector<HTMLInputElement>('input[type="text"]')!;
        countInput.addEventListener('input', () => this.newObj.count = countInput.valueAsNumber);
        itemInput.addEventListener('input', () => this.newObj.description = itemInput.value);
        const addButton = this.shadowRoot!.querySelector('button')!;
        addButton.addEventListener('click', this.dispatchNewItemAdd.bind(this));
        const resetButton = this.shadowRoot!.querySelector('button ~ button')!;
        resetButton.addEventListener('click', () => {
            this.newObj.count = 0;
            this.newObj.description = '';
            this.render();
        });
    }

    dispatchNewItemAdd() {
        const event = new CustomEvent('new-item-added', { detail: this.newObj });
        this.dispatchEvent(event);
    }
}

