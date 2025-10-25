import { MyDialog } from "./MyDialog";
export class MyDialogOkCancel extends MyDialog {
    constructor() {
        super();
        const actions = [
            { 
                text: 'Ok', 
                value: true 
            }, 
            { 
                text: 'Avbryt', 
                value: false 
            }
        ];
        this.set('actions', actions);
    }
}