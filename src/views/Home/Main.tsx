import { FormEvent, MouseEvent, useState } from "react";
import { Openai } from "../../types";
import { fetchTool } from "../../utils/api.util";
import { useHome } from "./Home";

import { FaRegImage } from "react-icons/fa6";

interface Props {
    reloadImages(): void;
    reloadPrompts(): void;
}

export const Main = ({ reloadImages, reloadPrompts }: Props) => {
    const { description, examplePrompt, genericPrompt, prompt, setDescription, setExamplePrompt, setGenericPrompt, setPrompt, setVariablesExamples, variablesExamples } = useHome();

    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingFill, setLoadingFill] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const [loadingVariablesExamples, setLoadingVariablesExamples] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        <main className="main home">
            <form onSubmit={handleSubmit} className="home__part">
                <textarea
                    minLength={1}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="home__textarea"
                    placeholder="Wpisz na jaki temat mam wygenerować prompt"
                />
                <button className="home__submit" disabled={loading}>{loading ? 'Generowanie generycznego promptu...' : 'Wygeneruj generyczny prompt'}</button>
            </form>
            <div className="home__part">
                <textarea
                    value={genericPrompt}
                    onChange={e => setGenericPrompt(e.target.value)}
                    className="home__textarea"
                    placeholder="Generyczny prompt"
                />
                <button className="home__submit" disabled={loadingFill} onClick={handleVariablesRefill}>
                    {loadingFill ? 'Wypełnianie promptu...' : 'Wypełnij prompt nowymi zmiennymi'}
                </button>
            </div>
            <div className="home__part">
                <textarea
                    value={examplePrompt}
                    onChange={e => setExamplePrompt(e.target.value)}
                    className="home__textarea"
                    placeholder="Wypełniony przykład promptu"
                />
                <button className="home__submit home__submit--big" disabled={loadingImage} onClick={handleImageGenerate}>
                    {loadingImage ? 'Generowanie grafiki...' : <FaRegImage className="home__submit-icon" />}
                </button>
            </div>
            <div className="home__part">
                <button className="home__submit" disabled={loadingDescription} onClick={handleDescriptionGenerate}>
                    {loadingDescription ? 'Generowanie opisu...' : 'Wygeneruj opis na Prompt Base'}
                </button>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="home__textarea"
                    placeholder="Opis promptu na PromptBase"
                />
            </div>
            <div className="home__part">
                <button className="home__submit" disabled={loadingVariablesExamples} onClick={handleVariablesExampleGenerate}>
                    {loadingVariablesExamples ? 'Generowanie przykładów do zmiennych...' : 'Wygeneruj przykłady do zmiennych'}
                </button>
                <textarea
                    value={getPromptTip()}
                    className="home__textarea"
                    placeholder="Podpowiedź do promptu"
                    readOnly
                />
            </div>
        </main>
    );
};