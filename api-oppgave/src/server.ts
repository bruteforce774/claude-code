import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import * as db from './db';

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the root directory (for Vite dev server compatibility)
app.use(express.static(path.join(process.cwd())));

// ============================================
// CRUD ENDPOINTS
// ============================================

// READ - Get all todos
app.get('/api/todos', (req: Request, res: Response) => {
    const todos = db.getAllTodos();
    res.json(todos);
});

// CREATE - Add new todo
app.post('/api/todos', (req: Request, res: Response) => {
    const { text, urgent, important } = req.body;

    // Validation: text is required
    if (!text) {
        return res.status(400).json({ error: 'Missing text' });
    }

    // Create new todo in database (ID auto-generated)
    const newTodo = db.createTodo({
        text,
        urgent: urgent || false,
        important: important || false
    });

    res.status(201).json(newTodo); // 201 = Created
});

// UPDATE - Modify existing todo
app.put('/api/todos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { text, completed, urgent, important } = req.body;

    // Update todo in database (partial update supported)
    const updatedTodo = db.updateTodo(id, {
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
        ...(urgent !== undefined && { urgent }),
        ...(important !== undefined && { important })
    });

    if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
});

// DELETE - Remove todo
app.delete('/api/todos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    // Delete todo from database
    const deleted = db.deleteTodo(id);

    if (!deleted) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Deleted' });
});

// ============================================
// START SERVER
// ============================================
app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});
