import { MouseEvent } from "react";
import { Openai } from "../../types";
import { useHome } from "./Home";

interface Props {
    item: Openai.CreatePromptResponse;
    refference: ((node: any) => void) | null;
}

export const PromptItem = ({ item, refference }: Props) => {
    const { descriptivePrompt, examplePrompt, genericPrompt, originalPrompt } = item;

    const { setExamplePrompt, setGenericPrompt, setPrompt } = useHome();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setExamplePrompt(examplePrompt);
        setGenericPrompt(genericPrompt);
        setPrompt(originalPrompt);
    };

    return (
        <li ref={refference} className="prompt__item">
            <div>
                <h2>Original Prompt</h2>
                <p>{originalPrompt}</p>
            </div>
            <div>
                <h2>Descriptive Prompt</h2>
                <p>{descriptivePrompt}</p>
            </div>
            <div>
                <h2>Generic Prompt</h2>
                <p>{genericPrompt}</p>
            </div>
            <div>
                <h2>Example Prompt</h2>
                <p>{examplePrompt}</p>
            </div>
            <button onClick={handleClick} className="home__submit">fill textareas</button>
        </li>
    );
};