import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
const app = express();
app.use(express.json()); // lar oss lese JSON-body
console.log(process.cwd());
app.use(express.static(path.join(process.cwd(), 'public')));

let items = ['apple', 'banana', 'orange'];

// READ (GET)
app.get('/api/items', (req: Request, res: Response) => {
    res.json(items);
});

// CREATE (POST)
app.post('/api/items', (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    items.push(name);
    res.status(201).json({ message: 'Added', items });
});

// UPDATE (PUT)
app.put('/api/items/:index', (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    const { name } = req.body;
    if (!items[index]) return res.status(404).json({ error: 'Not found' });
    items[index] = name;
    res.json({ message: 'Updated', items });
});

// DELETE
app.delete('/api/items/:index', (req: Request, res: Response) => {
    const index = parseInt(req.params.index);
    if (!items[index]) return res.status(404).json({ error: 'Not found' });
    items.splice(index, 1);
    res.json({ message: 'Deleted', items });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(3000, () => console.log('http://localhost:3000'));
