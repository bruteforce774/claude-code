import { BaseComponent } from "../components/BaseComponent";
import type { AppState, Item } from "../types";

export class MyApp extends BaseComponent {
    private state: AppState = {
        items: []
    };

    render() {
        this.shadowRoot!.innerHTML = /*HTML*/`
            <add-new-form title="Legg til ny"></add-new-form>
            <my-list></my-list>
            <my-dialog-ok-cancel title="Vil du fortsette?"></my-dialog-ok-cancel>
        `;

        const addNewForm = this.shadowRoot!.querySelector('add-new-form') as HTMLElement;
        addNewForm.addEventListener('new-item-added', this.newItemAdded.bind(this));

        const myList = this.shadowRoot!.querySelector('my-list') as BaseComponent;
        if (myList) {
            myList.set('items', this.state.items);
            myList.render(); // burde ikke vært nødvendig
        }
    }

    newItemAdded(e: Event) {
        const customEvent = e as CustomEvent;
        this.state.items.push(customEvent.detail as Item);
        this.render();
    }
}


