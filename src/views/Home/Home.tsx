import { ImageAside } from "./ImageAside";
import { PromptsAside } from "./PromptsAside";
import { Main } from "./Main";
import { useSearch } from "../../hooks/useSearch";
import { Image, Openai } from "../../types";
import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from "react";

interface HomeContextValue {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    genericPrompt: string;
    setGenericPrompt: Dispatch<SetStateAction<string>>;
    examplePrompt: string;
    setExamplePrompt: Dispatch<SetStateAction<string>>;
}

const HomeContext = createContext<HomeContextValue>(null!);

export const useHome = () => useContext(HomeContext);

const LIMIT = 16;

export const Home = () => {
    const images = useSearch<Image>('file/images', LIMIT);
    const prompts = useSearch<Openai.CreatePromptResponse>('openai/prompts', LIMIT);


    const [prompt, setPrompt] = useState('');
    const [genericPrompt, setGenericPrompt] = useState('');
    const [examplePrompt, setExamplePrompt] = useState('');

    return (
        <HomeContext.Provider value={{
            examplePrompt,
            genericPrompt,
            prompt,
            setExamplePrompt,
            setGenericPrompt,
            setPrompt,
        }}>
            <div className="wrapper">
                {useMemo(() => <ImageAside limit={LIMIT} search={images} />, [images])}
                {useMemo(() => <Main reloadImages={images.refresh} reloadPrompts={prompts.refresh} />, [])}
                {useMemo(() => <PromptsAside limit={LIMIT} search={prompts} />, [prompts])}
            </div>
        </HomeContext.Provider>
    );
};