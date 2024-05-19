import { Dispatch, SetStateAction, useCallback, useRef } from "react";

export const useInfiniteScroll = (amount: number, hasMore: boolean, loading: boolean, page: number, limit: number, setPage: Dispatch<SetStateAction<number>>) => {
    const observer = useRef<IntersectionObserver>();
    const lastDataElementRef = useCallback((node: HTMLLIElement) => {
        if (loading || amount < page * limit) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        }, {
            threshold: 0,
            rootMargin: '0px',
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return { lastDataElementRef };
};