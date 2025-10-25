import Database from 'better-sqlite3';
import type { TodoItem } from './types.js';

// Type for database row (SQLite returns different types)
type TodoRow = {
    id: number;
    text: string;
    completed: number;  // SQLite stores boolean as 0/1
    urgent: number;
    important: number;
    created_at: string;
};

// ============================================
// DATABASE INITIALIZATION
// ============================================

// Create/open database file
const db = new Database('./todos.db');

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// ============================================
// CREATE TABLE SCHEMA
// ============================================

// Create todos table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        urgent BOOLEAN NOT NULL DEFAULT 0,
        important BOOLEAN NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('✅ Database initialized');

// ============================================
// PREPARED STATEMENTS (for performance & security)
// ============================================

// Prevent SQL injection by using prepared statements
const statements = {
    getAll: db.prepare('SELECT * FROM todos ORDER BY created_at DESC'),

    getById: db.prepare('SELECT * FROM todos WHERE id = ?'),

    create: db.prepare(`
        INSERT INTO todos (text, completed, urgent, important)
        VALUES (@text, @completed, @urgent, @important)
    `),

    update: db.prepare(`
        UPDATE todos
        SET text = @text,
            completed = @completed,
            urgent = @urgent,
            important = @important
        WHERE id = @id
    `),

    delete: db.prepare('DELETE FROM todos WHERE id = ?')
};

// ============================================
// CRUD FUNCTIONS
// ============================================

/**
 * Get all todos from database
 */
export function getAllTodos(): TodoItem[] {
    const rows = statements.getAll.all() as TodoRow[];
    return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
        urgent: Boolean(row.urgent),
        important: Boolean(row.important)
    }));
}

/**
 * Get a single todo by ID
 */
export function getTodoById(id: number): TodoItem | undefined {
    const row = statements.getById.get(id) as TodoRow | undefined;
    if (!row) return undefined;

    return {
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
        urgent: Boolean(row.urgent),
        important: Boolean(row.important)
    };
}

/**
 * Create a new todo
 */
export function createTodo(data: {
    text: string;
    urgent: boolean;
    important: boolean;
}): TodoItem {
    const info = statements.create.run({
        text: data.text,
        completed: 0,
        urgent: data.urgent ? 1 : 0,
        important: data.important ? 1 : 0
    });

    // Get the newly created todo
    const newTodo = getTodoById(info.lastInsertRowid as number);
    if (!newTodo) {
        throw new Error('Failed to create todo');
    }

    return newTodo;
}

/**
 * Update an existing todo (partial update supported)
 */
export function updateTodo(id: number, data: Partial<Omit<TodoItem, 'id'>>): TodoItem | undefined {
    // First get the existing todo
    const existing = getTodoById(id);
    if (!existing) return undefined;

    // Merge existing data with updates
    const updated = {
        id,
        text: data.text ?? existing.text,
        completed: data.completed ?? existing.completed,
        urgent: data.urgent ?? existing.urgent,
        important: data.important ?? existing.important
    };

    // Update in database
    statements.update.run({
        id: updated.id,
        text: updated.text,
        completed: updated.completed ? 1 : 0,
        urgent: updated.urgent ? 1 : 0,
        important: updated.important ? 1 : 0
    });

    return updated;
}

/**
 * Delete a todo by ID
 */
export function deleteTodo(id: number): boolean {
    const info = statements.delete.run(id);
    return info.changes > 0;
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Close database connection when app exits
process.on('exit', () => db.close());
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});
