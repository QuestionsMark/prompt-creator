import { HOST_ADDRESS } from "../../../../config/config";
import { Image } from "../../../types";

interface Props {
    item: Image;
    refference: ((node: any) => void) | null;
}

export const ImageItem = ({ item, refference }: Props) => {
    const { id } = item;

    return (
        <li ref={refference} className="images__item">
            <a href={`${HOST_ADDRESS}/file/${id}`} target="_blank">
                <img src={`${HOST_ADDRESS}/file/${id}`} alt="generated image" className="images__item-img" />
            </a>
        </li>
    );
};