import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the root directory (for Vite dev server compatibility)
app.use(express.static(path.join(process.cwd())));

// ============================================
// DATA MODEL - Eisenhower Matrix Todo Items
// ============================================
type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
    urgent: boolean;
    important: boolean;
};

// In-memory database (data lives in RAM)
let todos: TodoItem[] = [];
let nextId = 1; // Auto-incrementing ID

// ============================================
// CRUD ENDPOINTS
// ============================================

// READ - Get all todos
app.get('/api/todos', (req: Request, res: Response) => {
    res.json(todos);
});

// CREATE - Add new todo
app.post('/api/todos', (req: Request, res: Response) => {
    const { text, urgent, important } = req.body;

    // Validation: text is required
    if (!text) {
        return res.status(400).json({ error: 'Missing text' });
    }

    // Create new todo with auto-generated ID
    const newTodo: TodoItem = {
        id: nextId++,
        text,
        completed: false, // New todos are not completed
        urgent: urgent || false,
        important: important || false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo); // 201 = Created
});

// UPDATE - Modify existing todo
app.put('/api/todos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    // Update the todo (merge new data with existing)
    const { text, completed, urgent, important } = req.body;
    const updatedTodo: TodoItem = {
        ...todos[todoIndex],
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(urgent !== undefined && { urgent }),
        ...(important !== undefined && { important })
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
});

// DELETE - Remove todo
app.delete('/api/todos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.json({ message: 'Deleted' });
});

// ============================================
// START SERVER
// ============================================
app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});
