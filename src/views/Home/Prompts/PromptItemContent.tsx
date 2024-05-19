import { Openai, PromptItemNav } from "../../../types";

interface Props {
    nav: PromptItemNav;
    item: Openai.CreatePromptResponse;
}

export const PromptItemContent = ({ item, nav }: Props) => {
    const { descriptivePrompt, examplePrompt, genericPrompt, originalPrompt } = item;

    const getPrompt = () => {
        switch (nav) {
            case PromptItemNav.Descriptive: {
                return descriptivePrompt;
            }
            case PromptItemNav.Example: {
                return examplePrompt;
            }
            case PromptItemNav.Generic: {
                return genericPrompt;
            }
            case PromptItemNav.Original: {
                return originalPrompt;
            }
        }
    };

    return <p className="prompts__item-content">{getPrompt()}</p>;
};