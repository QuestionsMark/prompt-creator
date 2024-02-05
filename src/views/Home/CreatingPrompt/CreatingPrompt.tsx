import { MouseEvent, useState } from "react";
import { useApp } from "../../../contexts/app.context";
import { fetchTool } from "../../../utils/api.util";
import { Openai } from "../../../types";
import { FaRegImage } from "react-icons/fa6";
import { CreatingPromptSection } from "./CreatingPromptSection";

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

    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingFill, setLoadingFill] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const [loadingVariablesExamples, setLoadingVariablesExamples] = useState(false);

    const handleGenericPromptCreate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoading(true);
        setLoadingFill(true);
        const response = await fetchTool<Openai.CreatePromptResponse>('openai/prompt', 'POST', { prompt });
        setLoading(false);
        setLoadingFill(false);
        if (!response.status) return console.warn(response.message);
        const { examplePrompt, genericPrompt } = response.results;

        setGenericPrompt(genericPrompt);
        setExamplePrompt(examplePrompt);
        reloadPrompts();
    };

    const handleImageGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoadingImage(true);
        const response = await fetchTool<string>('openai/image', 'POST', { prompt: examplePrompt });
        setLoadingImage(false);
        if (!response.status) return console.warn(response.message);

        reloadImages();
    };

    const handleVariablesRefill = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoadingFill(true);
        const response = await fetchTool<string>('openai/prompt/refill', 'POST', { prompt: genericPrompt });
        setLoadingFill(false);
        if (!response.status) return console.warn(response.message);

        setExamplePrompt(response.results);
    };

    const handleDescriptionGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoadingDescription(true);
        const response = await fetchTool<string>('openai/prompt/description', 'POST', { prompt: prompt });
        setLoadingDescription(false);
        if (!response.status) return console.warn(response.message);

        setDescription(response.results);
    };

    const handleVariablesExampleGenerate = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

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
            <CreatingPromptSection
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onSubmit={handleGenericPromptCreate}
                placeholder="Wpisz na jaki temat mam wygenerować prompt"
                submitValue={loading ? 'Generowanie generycznego promptu...' : 'Wygeneruj generyczny prompt'}
                submitDisabled={loading}
            />
            <CreatingPromptSection
                value={genericPrompt}
                onChange={e => setGenericPrompt(e.target.value)}
                onSubmit={handleVariablesRefill}
                placeholder="Generyczny prompt"
                submitValue={loadingFill ? 'Wypełnianie promptu...' : 'Wypełnij prompt nowymi zmiennymi'}
                submitDisabled={loadingFill}
            />
            <CreatingPromptSection
                value={examplePrompt}
                onChange={e => setExamplePrompt(e.target.value)}
                onSubmit={handleImageGenerate}
                placeholder="Wypełniony przykład promptu"
                submitValue={loadingImage ? 'Generowanie grafiki...' : <FaRegImage className="creating-prompt__submit-icon" />}
                submitDisabled={loadingImage}
                submitBig
            />
            <CreatingPromptSection
                value={description}
                onChange={e => setDescription(e.target.value)}
                onSubmit={handleDescriptionGenerate}
                placeholder="Opis promptu na PromptBase"
                submitValue={loadingDescription ? 'Generowanie opisu...' : 'Wygeneruj opis na Prompt Base'}
                submitDisabled={loadingDescription}
                reversed
            />
            <CreatingPromptSection
                value={getPromptTip()}
                onChange={e => setDescription(e.target.value)}
                onSubmit={handleVariablesExampleGenerate}
                placeholder="Podpowiedź do promptu"
                readOnly
                submitValue={loadingVariablesExamples ? 'Generowanie przykładów do zmiennych...' : 'Wygeneruj przykłady do zmiennych'}
                submitDisabled={loadingVariablesExamples}
                reversed
            />
        </main>
    );
};