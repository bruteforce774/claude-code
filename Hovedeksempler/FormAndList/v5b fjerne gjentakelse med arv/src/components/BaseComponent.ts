export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static propNames: string[];

    static get observedAttributes() {
        return this.propNames;
    }

    get(name: string): any {
        if (!this.hasAttribute(name)) {
            return null;
        }

        const value = this.getAttribute(name)!;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    set(name: string, value: any) {
        const valueToSave =
            typeof (value) != 'object'
                ? value
                : JSON.stringify(value);

        this.setAttribute(name, valueToSave);
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
    }
}