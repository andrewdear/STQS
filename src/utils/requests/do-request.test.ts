import {doRequest} from "./do-request.ts";
import {beforeEach, describe, expect, it, vi} from 'vitest'

const mockData = {data: 'helloWorld'};

global.fetch = vi.fn();

function createFetchResponse(data: any, ok = true) {
    return {ok, json: () => new Promise((resolve) => resolve(data))}
}

describe('doRequest', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should call fetch correctly and return the correct response with default values', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockData) as Response)

        const data = await doRequest('test.com');

        expect(data).toEqual({ok: true, data: mockData})

        expect(fetch).toHaveBeenCalledWith('test.com',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            })
    })

    it('should add the page argument to the url when passed', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockData) as Response)

        const data = await doRequest('test.com', {page: 1});

        expect(data).toEqual({ok: true, data: mockData})

        expect(fetch).toHaveBeenCalledWith('test.com?page=1',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            })
    })

    it('should add the Authorized header to the headers when passed', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockData) as Response)

        const data = await doRequest('test.com', {token: 'hello'});

        expect(data).toEqual({ok: true, data: mockData})

        expect(fetch).toHaveBeenCalledWith('test.com',
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer hello',
                },
                method: 'GET',
            })
    })

    it('should add body data as a string when passed', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(mockData) as Response)

        const data = await doRequest('test.com', {body: {hello: 'world'}});

        expect(data).toEqual({ok: true, data: mockData})

        expect(fetch).toHaveBeenCalledWith('test.com',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                body: '{"hello":"world"}'
            })
    })

    it('should return exposed errors correctly', async () => {
        const error = {error: 'something went wrong'}
        vi.mocked(fetch).mockResolvedValueOnce(createFetchResponse(error, false) as Response)

        const data = await doRequest('test.com');

        expect(data).toEqual({ok: false, data: error})

        expect(fetch).toHaveBeenCalledWith('test.com',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            })
    })

    it('should return thrown errors correctly', async () => {
        const error = 'something went wrong'
        vi.mocked(fetch).mockRejectedValueOnce(createFetchResponse(error, false) as Response)

        const data = await doRequest('test.com');

        expect(data).toEqual({ok: false, data: {error: 'something has gone wrong with request'}})

        expect(fetch).toHaveBeenCalledWith('test.com',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            },)
    })
})