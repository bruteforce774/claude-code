// TodoItem matches our backend API structure
export type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
    urgent: boolean;
    important: boolean;
};

// App state (what the main view holds)
export type AppState = {
    todos: TodoItem[];
};
