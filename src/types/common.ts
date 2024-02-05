export interface Image {
    id: string;
    createdAt: string;
}

export enum PromptItemNav {
    Original = 'Original',
    Descriptive = 'Descriptive',
    Generic = 'Generic',
    Example = 'Example',
}