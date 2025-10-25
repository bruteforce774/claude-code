import { BaseComponent } from './BaseComponent';
import type { Item } from '../types';

export class ItemList extends BaseComponent {
    propNames = ['items'];
    render() {
        const items = this.get('items') as Item[] ?? [];
        console.log(items);
        this.shadowRoot!.innerHTML = /*HTML*/`
            <fieldset> 
                <legend>Alle punktene:</legend>           
                    ${items.length == 0 ?/*HTML*/`
                        &lt;<i>ingen punkter</i>&gt;
                    `:/*HTML*/`
                    <ul>
                        ${items.map(item => /*HTML*/`
                            <li>${item.count} - ${item.description}</li>
                        `).join('')}
                    </ul>                       
                    `}
            </fieldset>
        `;
    }
}
