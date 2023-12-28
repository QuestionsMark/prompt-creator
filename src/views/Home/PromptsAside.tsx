import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { SearchResult } from "../../hooks/useSearch";
import { Openai } from "../../types";
import { PromptItem } from "./PromptItem";

interface Props {
    limit: number;
    search: SearchResult<Openai.CreatePromptResponse>;
}

export const PromptsAside = ({ limit, search }: Props) => {
    const { amount, data, hasMore, loading, page, setPage } = search;
    const { lastDataElementRef } = useInfiniteScroll(amount, hasMore, loading, page, limit, setPage);

    const promptsList = () => {
        return data.map((i, index) => <PromptItem key={i.id} refference={data.length === index + 1 ? lastDataElementRef : null} item={i} />);
    };

    return (
        <aside className="aside">
            <ul className="prompt__list">
                {promptsList()}
            </ul>
        </aside>
    );
};