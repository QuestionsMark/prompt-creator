export namespace Openai {
    export interface ChatResponse {
        content: null | string;
    }

    export interface CreatePromptResponse {
        descriptivePrompt: string;
        examplePrompt: string;
        genericPrompt: string;
        originalPrompt: string;
        id: string;
        createdAt: string;
    }

    export interface VariableExample {
        variableName: string;
        examples: string[];
    }
}