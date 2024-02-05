import { MouseEvent, useState } from "react";
import { Openai, PromptItemNav as PromptItemNavInterface } from "../../../types";
import { PromptItemContent } from "./PromptItemContent";
import { PromptItemNav } from "./PromptItemNav";
import { useApp } from "../../../contexts/app.context";

interface Props {
    item: Openai.CreatePromptResponse;
    refference: ((node: any) => void) | null;
}

export const PromptItem = ({ item, refference }: Props) => {
    const { examplePrompt, genericPrompt, originalPrompt } = item;

    const { setExamplePrompt, setGenericPrompt, setPrompt } = useApp();

    const [nav, setNav] = useState<PromptItemNavInterface>(PromptItemNavInterface.Original);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setExamplePrompt(examplePrompt);
        setGenericPrompt(genericPrompt);
        setPrompt(originalPrompt);
    };

    return (
        <li ref={refference} className="prompts__item">
            <PromptItemNav nav={nav} setNav={setNav} />
            <PromptItemContent item={item} nav={nav} />
            <button onClick={handleClick} className="prompts__item-btn">Fill inputs</button>
        </li>
    );
};