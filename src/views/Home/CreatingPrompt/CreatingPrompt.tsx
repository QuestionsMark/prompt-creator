import { MouseEvent, useRef, useState } from "react";
import { useApp } from "../../../contexts/app.context";
import { fetchTool } from "../../../utils/api.util";
import { Openai } from "../../../types";
import { FaRegImage } from "react-icons/fa6";
import { CreatingPromptSection } from "./CreatingPromptSection";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

export const CreatingPrompt = () => {
    const {
        description,
        examplePrompt,
        genericPrompt,
        prompt,
        reloadImages,
        reloadPrompts,
        setDescription,
        setExamplePrompt,
        setGenericPrompt,
        setPrompt,
        setVariablesExamples,
        variablesExamples,
    } = useApp();

    const apiKeyInput = useRef<HTMLInputElement>(null);

    const [apiKey, setApiKey] = useLocalStorage<string>('api-key', '');
    const [loadingPrompt, setLoadingPrompt] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingFill, setLoadingFill] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const [loadingVariablesExamples, setLoadingVariablesExamples] = useState(false);

    const handleGenericPromptCreate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!apiKey) return apiKeyInput.current?.focus();

        setLoadingPrompt(true);
        setLoadingFill(true);
        const response = await fetchTool<Openai.CreatePromptResponse>('openai/prompt', 'POST', { prompt });
        setLoadingPrompt(false);
        setLoadingFill(false);
        if (!response.status) return console.warn(response.message);
        const { examplePrompt, genericPrompt } = response.results;

        setGenericPrompt(genericPrompt);
        setExamplePrompt(examplePrompt);
        reloadPrompts();
    };

    const handleImageGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!apiKey) return apiKeyInput.current?.focus();

        setLoadingImage(true);
        const response = await fetchTool<string>('openai/image', 'POST', { prompt: examplePrompt });
        setLoadingImage(false);
        if (!response.status) return console.warn(response.message);

        reloadImages();
    };

    const handleVariablesRefill = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!apiKey) return apiKeyInput.current?.focus();

        setLoadingFill(true);
        const response = await fetchTool<string>('openai/prompt/refill', 'POST', { prompt: genericPrompt });
        setLoadingFill(false);
        if (!response.status) return console.warn(response.message);

        setExamplePrompt(response.results);
    };

    const handleDescriptionGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!apiKey) return apiKeyInput.current?.focus();

        setLoadingDescription(true);
        const response = await fetchTool<string>('openai/prompt/description', 'POST', { prompt: prompt });
        setLoadingDescription(false);
        if (!response.status) return console.warn(response.message);

        setDescription(response.results);
    };

    const handleVariablesExampleGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!apiKey) return apiKeyInput.current?.focus();

        setLoadingVariablesExamples(true);
        const response = await fetchTool<Openai.VariableExample[]>('openai/prompt/variables-examples', 'POST', { prompt: genericPrompt });
        setLoadingVariablesExamples(false);
        if (!response.status) return console.warn(response.message);

        setVariablesExamples(response.results);
    };

    const getPromptTip = () => {
        const examples = variablesExamples.map(e => `[${e.variableName}] - ${e.examples.map(example => `"${example}"`).join(', ')}`).join('\n');
        return `Copy, paste and replace all variables like this:\n\n${examples}\n\nEnjoy!`;
    };

    return (
        <main className="main creating-prompt">
            <input
                ref={apiKeyInput}
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="OpenAI api key (saved only on your device)"
                className="creating-prompt__inp"
            />
            <CreatingPromptSection
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onSubmit={handleGenericPromptCreate}
                placeholder="Enter prompt to generate generic prompt"
                submitValue={loadingPrompt ? 'Generating...' : 'Generate generic prompt'}
                submitDisabled={loadingPrompt}
            />
            <CreatingPromptSection
                value={genericPrompt}
                onChange={e => setGenericPrompt(e.target.value)}
                onSubmit={handleVariablesRefill}
                placeholder="Generic prompt"
                submitValue={loadingFill ? 'Filling prompt...' : 'Fill generic prompt with examples variables'}
                submitDisabled={loadingFill}
            />
            <CreatingPromptSection
                value={examplePrompt}
                onChange={e => setExamplePrompt(e.target.value)}
                onSubmit={handleImageGenerate}
                placeholder="Prompt example"
                submitValue={loadingImage ? 'Generating...' : <FaRegImage className="creating-prompt__submit-icon" />}
                submitDisabled={loadingImage}
                submitBig
            />
            <CreatingPromptSection
                value={description}
                onChange={e => setDescription(e.target.value)}
                onSubmit={handleDescriptionGenerate}
                placeholder="Prompt Base prompt description"
                submitValue={loadingDescription ? 'Generating...' : 'Generate prompt description to Prompt Base'}
                submitDisabled={loadingDescription}
                reversed
            />
            <CreatingPromptSection
                value={getPromptTip()}
                onChange={e => setDescription(e.target.value)}
                onSubmit={handleVariablesExampleGenerate}
                placeholder="Prompt Base prompt tip"
                readOnly
                submitValue={loadingVariablesExamples ? 'Generating...' : 'Generate examples for variables'}
                submitDisabled={loadingVariablesExamples}
                reversed
            />
        </main>
    );
};