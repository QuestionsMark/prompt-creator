import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Openai } from "../types";

interface Props {
    children: ReactNode;
}

interface AppContextValue {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    genericPrompt: string;
    setGenericPrompt: Dispatch<SetStateAction<string>>;
    examplePrompt: string;
    setExamplePrompt: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    variablesExamples: Openai.VariableExample[];
    setVariablesExamples: Dispatch<SetStateAction<Openai.VariableExample[]>>;
    imagesReloadFlag: boolean | null;
    reloadImages(): void;
    promptsReloadFlag: boolean | null;
    reloadPrompts(): void;
}

const AppContext = createContext<AppContextValue>(null!);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
    const [prompt, setPrompt] = useState('');
    const [genericPrompt, setGenericPrompt] = useState('');
    const [examplePrompt, setExamplePrompt] = useState('');
    const [description, setDescription] = useState('');
    const [variablesExamples, setVariablesExamples] = useState<Openai.VariableExample[]>([]);
    const [imagesReloadFlag, setImagesReloadFlag] = useState<boolean | null>(null);
    const [promptsReloadFlag, setPromptsReloadFlag] = useState<boolean | null>(null);

    const reloadImages = () => setImagesReloadFlag(s => !s);
    const reloadPrompts = () => setPromptsReloadFlag(s => !s);

    return (
        <AppContext.Provider value={{
            description,
            examplePrompt,
            genericPrompt,
            prompt,
            setDescription,
            setExamplePrompt,
            setGenericPrompt,
            setPrompt,
            setVariablesExamples,
            variablesExamples,
            imagesReloadFlag,
            promptsReloadFlag,
            reloadImages,
            reloadPrompts,
        }}>
            {children}
        </AppContext.Provider>
    );
};