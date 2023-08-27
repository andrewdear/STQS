import {InputOptions, Method} from "./types.ts";

type Headers = {
    'Content-Type': 'application/json',
    Authorization?: string
}

type RequestOptions = {
    headers: Headers,
    method: Method,
    body?: string
}

export type errorType = { error: { message: string } }

export const doRequest = async <T>(url: string, {page, token, method = 'GET', body}: InputOptions = {}): Promise<{
    ok: boolean,
    data: T | errorType
}> => {
    let requestUrl = url;
    if (page) {
        requestUrl = `${requestUrl}?page=${page}`
    }

    const headers: Headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const options: RequestOptions = {
        headers,
        method
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    try {
        const resp = await fetch(requestUrl, options)

        const data = await resp.json()

        return {ok: resp.ok, data};
    } catch (e) {
        console.log('Something has gone wrong', e);
        return {
            ok: false, data: {error: {message: 'something has gone wrong with request'}}
        }
    }
}