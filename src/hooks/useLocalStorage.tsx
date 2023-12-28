import { useState, useEffect } from 'react';

const PREFIX = 'prompt-generator-';

export const setLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
};

export const getLocalStorage = (key: string): any => {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value && JSON.parse(value);
};

export const deleteLocalStorage = (key: string): void => {
    localStorage.removeItem(`${PREFIX}${key}`);
};

export function useLocalStorage(key: string, initialValue: any) {


    const [value, setValue] = useState(() => {
        const storageValue = getLocalStorage(key);
        if (storageValue !== null) return storageValue;
        if (typeof initialValue === 'function') {
            return initialValue();
        }
        return initialValue;
    });

    useEffect(() => {
        setLocalStorage(key, value);
    }, [value, key]);

    return [value, setValue];
}