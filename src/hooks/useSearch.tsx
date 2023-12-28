import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios, { Canceler, AxiosError } from 'axios';
import { HOST_ADDRESS } from '../../config/config';

export interface SearchResult<T> {
    data: T[];
    loading: boolean;
    hasMore: boolean;
    amount: number;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    refresh(): void;
    reset(): void;
}

export function useSearch<T>(
    collection: string,
    limit: number,
): SearchResult<T> {
    const delayTimeoutId = useRef<NodeJS.Timeout | null>(null);

    const [reload, setReload] = useState(false);
    const [page, setPage] = useState(1);

    const refresh = () => {
        setReload(state => !state);
        setPage(1);
    };

    const reset = () => {
        setData([]);
    };

    useEffect(() => {
        setData([]);
    }, [reload]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [amount, setAmount] = useState(0);


    useEffect(() => {
        (async () => {
            const startTime = new Date().valueOf();
            if (delayTimeoutId.current) {
                clearTimeout(delayTimeoutId.current);
            }
            let cancel: Canceler;
            setLoading(true);
            axios({
                method: 'GET',
                url: `${HOST_ADDRESS}/${collection}`,
                params: {
                    page,
                    limit,
                },
                cancelToken: new axios.CancelToken(c => cancel = c),
                withCredentials: true,
            })
                .then(res => {
                    const endTime = new Date().valueOf();
                    delayTimeoutId.current = setTimeout(() => {
                        setLoading(false);
                        setAmount(res.data.count);
                        setData(prev => [...prev, ...res.data.results]);
                        setHasMore(res.data.results.length > 0);
                    }, endTime - startTime < 500 ? 500 - (endTime - startTime) : 0);
                })
                .catch((e: AxiosError) => {
                    const endTime = new Date().valueOf();
                    delayTimeoutId.current = setTimeout(() => {
                        setLoading(false);
                        if (axios.isCancel(e)) return;
                        const errorObject = (e as AxiosError).toJSON() as { status: number };
                        if (errorObject.status === 403) {
                            // Logout client
                            return;
                        }
                        if (axios.isCancel(e)) return;
                    }, endTime - startTime < 500 ? 500 - (endTime - startTime) : 0);
                });

            return () => {
                if (delayTimeoutId.current) {
                    clearTimeout(delayTimeoutId.current);
                }
                cancel();
            }
        })()
    }, [page, collection, reload]);

    return { loading, data, hasMore, amount, page, setPage, refresh, reset };
}