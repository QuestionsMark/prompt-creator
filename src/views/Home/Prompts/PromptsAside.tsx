import { useEffect, useMemo } from "react";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useSearch } from "../../../hooks/useSearch";
import { Openai } from "../../../types";
import { PromptItem } from "./PromptItem";
import { useApp } from "../../../contexts/app.context";

const LIMIT = 16;

export const PromptsAside = () => {
    const { promptsReloadFlag } = useApp();
    const { amount, data, hasMore, loading, page, refresh, setPage } = useSearch<Openai.CreatePromptResponse>('openai/prompts', LIMIT);
    const { lastDataElementRef } = useInfiniteScroll(amount, hasMore, loading, page, LIMIT, setPage);

    const promptsList = () => {
        return data.map((i, index) => <PromptItem key={i.id} refference={data.length === index + 1 ? lastDataElementRef : null} item={i} />);
    };

    useEffect(() => {
        if (promptsReloadFlag === null) return;
        refresh();
    }, [promptsReloadFlag]);

    return useMemo(() => (
        <aside className="aside">
            <ul className="prompts__list">
                {promptsList()}
            </ul>
        </aside>
    ), [data]);
};