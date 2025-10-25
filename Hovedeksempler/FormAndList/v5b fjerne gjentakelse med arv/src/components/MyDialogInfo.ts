import { MyDialog } from "./MyDialog";
export class MyDialogOkCancel extends MyDialog {
    constructor() {
        super();
        const actions = [
            { 
                text: 'Ok', 
                value: true 
            }
        ];
        this.set('actions', actions);
    }
}