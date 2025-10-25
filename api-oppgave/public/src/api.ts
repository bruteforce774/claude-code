import type { TodoItem } from './types';

// ============================================
// CORE HTTP REQUEST FUNCTION
// ============================================
async function doRequest<T>(
    verb: string,
    url: string,
    body: any = null
): Promise<T> {
    const options: RequestInit = {
        method: verb,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

// ============================================
// TODO API METHODS
// ============================================

/**
 * Fetch all todos from the server
 */
export async function getTodos(): Promise<TodoItem[]> {
    return doRequest<TodoItem[]>('GET', '/api/todos');
}

/**
 * Create a new todo on the server
 */
export async function createTodo(
    data: { text: string; urgent: boolean; important: boolean }
): Promise<TodoItem> {
    return doRequest<TodoItem>('POST', '/api/todos', data);
}

/**
 * Update an existing todo
 */
export async function updateTodo(
    id: number,
    data: Partial<Omit<TodoItem, 'id'>>
): Promise<TodoItem> {
    return doRequest<TodoItem>('PUT', `/api/todos/${id}`, data);
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: number): Promise<{ message: string }> {
    return doRequest<{ message: string }>('DELETE', `/api/todos/${id}`);
}

// ============================================
// USAGE EXAMPLE (commented out):
// ============================================
// const todos = await getTodos();
// const newTodo = await createTodo({ text: 'Buy milk', urgent: true, important: false });
// const updated = await updateTodo(5, { completed: true });
// await deleteTodo(5);
