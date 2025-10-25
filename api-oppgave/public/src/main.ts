import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { TodoApp } from './views/TodoApp';

// Register custom elements
customElements.define('add-todo-form', AddTodoForm);
customElements.define('todo-list', TodoList);
customElements.define('todo-app', TodoApp);

console.log('✅ Todo app components registered');
