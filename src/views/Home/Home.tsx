import { ImageAside } from "./Images/ImageAside";
import { PromptsAside } from "./Prompts/PromptsAside";
import { CreatingPrompt } from "./CreatingPrompt/CreatingPrompt";

export const Home = () => {
    return (
        <div className="home">
            <ImageAside />
            <CreatingPrompt />
            <PromptsAside />
        </div>
    );
};