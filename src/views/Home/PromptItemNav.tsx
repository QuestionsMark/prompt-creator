import { Dispatch, SetStateAction } from "react";
import { PromptItemNav as PromptItemNavInterface } from "../../types";

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
                className={`prompt-item__nav-item${nav === n ? ' active' : ''}`}
            >
                {n}
            </li>
        ))
    };
    return (
        <nav>
            <ul>
                {promptItemNavList()}
            </ul>
        </nav>
    );
};