import { Dispatch, SetStateAction } from "react";
import { PromptItemNav as PromptItemNavInterface } from "../../../types";

interface Props {
    nav: PromptItemNavInterface;
    setNav: Dispatch<SetStateAction<PromptItemNavInterface>>;
}

export const PromptItemNav = ({ nav, setNav }: Props) => {
    const promptItemNavList = () => {
        return Object.values(PromptItemNavInterface).map(n => (
            <li
                key={n}
                onClick={() => setNav(n)}
                className={`prompts__item-nav-item${nav === n ? ' active' : ''}`}
                tabIndex={0}
            >
                {n}
            </li>
        ))
    };
    return (
        <nav className="prompts__item-nav">
            <ul className="prompts__item-nav-list">
                {promptItemNavList()}
            </ul>
        </nav>
    );
};