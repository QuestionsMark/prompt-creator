import { HOST_ADDRESS } from "../../../config/config";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { SearchResult } from "../../hooks/useSearch";
import { Image } from "../../types";

interface Props {
    limit: number;
    search: SearchResult<Image>;
}

export const ImageAside = ({ limit, search }: Props) => {
    const { amount, data, hasMore, loading, page, setPage } = search;
    const { lastDataElementRef } = useInfiniteScroll(amount, hasMore, loading, page, limit, setPage);

    const imagesList = () => {
        return data.map((i, index) => (
            <li ref={data.length === index + 1 ? lastDataElementRef : null} key={i.id} className="home__item">
                <a href={`${HOST_ADDRESS}/file/${i.id}`} target="_blank">
                    <img src={`${HOST_ADDRESS}/file/${i.id}`} alt="generated image" className="home__image" />
                </a>
            </li>
        ));
    };

    return (
        <aside className="aside images">
            <ul className="home__list">
                {imagesList()}
            </ul>
        </aside>
    );
};