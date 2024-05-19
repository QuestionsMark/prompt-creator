import { useEffect, useMemo } from "react";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useSearch } from "../../../hooks/useSearch";
import { Image } from "../../../types";
import { ImageItem } from "./ImageItem";
import { useApp } from "../../../contexts/app.context";

const LIMIT = 16;

export const ImageAside = () => {
    const { imagesReloadFlag } = useApp();
    const { amount, data, hasMore, loading, page, refresh, setPage } = useSearch<Image>('file/images', LIMIT);
    const { lastDataElementRef } = useInfiniteScroll(amount, hasMore, loading, page, LIMIT, setPage);

    const imagesList = () => {
        return data.map((i, index) => <ImageItem key={i.id} item={i} refference={data.length === index + 1 ? lastDataElementRef : null} />);
    };

    useEffect(() => {
        if (imagesReloadFlag === null) return;
        refresh();
    }, [imagesReloadFlag]);

    return useMemo(() => (
        <aside className="aside images">
            <ul className="images__list">
                {imagesList()}
            </ul>
        </aside>
    ), [data]);
};