import { HOST_ADDRESS } from '../../config/config';
import { ClientResponse, ClientResponseError, Method, ServerErrorResponse } from '../types';

const setErrorResponse = (response: Response, res: ServerErrorResponse): ClientResponseError => {
    console.warn(res.message);
    if (response.status === 400) return { message: res.message, status: false, problems: res.problems };
    return { message: res.message, status: false };
};

export async function fetchTool<T>(path: string, method: Method = 'GET', body: any = undefined): Promise<ClientResponse<T>> {
    try {
        const apiKey = JSON.parse(window.localStorage.getItem('prompt-generator-api-key') ?? '');
        if (!apiKey) throw new Error('No OpenAI api key.');

        let headers = {};
        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            };
        }

        const response = await fetch(`${HOST_ADDRESS}/${path[0] === '/' ? path.slice(1) : path}`, {
            method,
            headers,
            body: body && JSON.stringify(body),
        });
        const res = await response.json();
        if (response.ok) return { ...res, status: true };
        return setErrorResponse(response, res);
    } catch (e) {
        return { message: (e as Error).message, status: false };
    }
}

export const showProblem = (response: ServerErrorResponse): string => {
    if (response.problems && response.problems.length !== 0) return `${response.message} ${response.problems.join(' ')}`;
    return response.message;
}