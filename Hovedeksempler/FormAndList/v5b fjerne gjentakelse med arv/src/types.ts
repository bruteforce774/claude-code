type AppState = {
    items: Item[];
};

type Item = {
    count: number;
    description: string;
};

export type { AppState, Item };