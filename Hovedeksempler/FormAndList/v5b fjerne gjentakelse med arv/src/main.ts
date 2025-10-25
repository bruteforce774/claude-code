import { AddNewForm } from "./components/AddNewForm";
import { ItemList } from "./components/ItemList";
import { MyDialog } from "./components/MyDialog";
import { MyDialogOkCancel } from "./components/MyDialogOkCancel";
import { MyApp } from "./views/MyApp";

customElements.define('my-list', ItemList);
customElements.define('add-new-form', AddNewForm);
customElements.define('my-dialog', MyDialog);
customElements.define('my-dialog-ok-cancel', MyDialogOkCancel);
customElements.define('my-app', MyApp);

