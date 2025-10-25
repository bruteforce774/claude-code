import { BaseComponent } from './BaseComponent';

interface Action {
    text: string;
    value: any;
}

export class MyDialog extends BaseComponent {
    propNames = ['title', 'actions'];
    render() {
        const title = this.get('title') as string;
        const actions = this.get('actions') as Action[];

        this.shadowRoot!.innerHTML = /*HTML*/`
            <style>
                dialog{
                    background-color: lightgray;
                }
            </style>
            <dialog open>
                <h3>${title}</h3>
                ${actions.map(a =>/*HTML*/`
                    <button>${a.text}</button>
                `).join('')}
            </dialog>
        `;

        const btns = this.shadowRoot!.querySelectorAll('button');
        for (let i = 0; i < btns.length; i++) {
            let btn = btns[i];
            btn.addEventListener('click', () => this.handleClick.bind(this)(i));
        }
    }

    handleClick(index: number) {
        const actions = this.get('actions') as Action[];
        const dialog = this.shadowRoot!.querySelector('dialog')!;
        dialog.close();
        const event = new CustomEvent('action', { detail: actions[index].value });
        this.dispatchEvent(event);
    }
}
