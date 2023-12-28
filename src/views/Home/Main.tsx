import { FormEvent, MouseEvent, useState } from "react";
import { Openai } from "../../types";
import { fetchTool } from "../../utils/api.util";
import { useHome } from "./Home";

interface Props {
    reloadImages(): void;
    reloadPrompts(): void;
}

export const Main = ({ reloadImages, reloadPrompts }: Props) => {
    const { examplePrompt, genericPrompt, prompt, setExamplePrompt, setGenericPrompt, setPrompt } = useHome();

    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingFill, setLoadingFill] = useState(false);

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
                <button className="home__submit" disabled={loadingImage} onClick={handleImageGenerate}>
                    {loadingImage ? 'Generowanie grafiki...' : 'Wygeneruj grafikę'}
                </button>
            </div>
        </main>
    );
};