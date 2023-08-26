import {doRequest} from "./do-request.ts";
import {getAllPaginatedData} from "./get-all-paginated-data.ts";
import {beforeEach, describe, expect, it, vi} from 'vitest'

vi.mock("./do-request.ts", () => ({
    doRequest: vi.fn(() => Promise.resolve(''))
}));

const mockSuccessfullResponse = {
    ok: true, data: {
        meta: {
            total: 19,
            page: 1,
            limit: 10
        },
        data: ["hello", "world"]
    }
}

const mockSuccessfullSecondResponse = {
    ok: true, data: {
        meta: {
            total: 19,
            page: 2,
            limit: 10
        },
        data: ["and", "again"]
    }
}

describe('getAllPaginatedData', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should call do request the correct amount of times with the correct parameters from what is returned in meta data', async () => {
        vi.mocked(doRequest).mockResolvedValueOnce(mockSuccessfullResponse)
        vi.mocked(doRequest).mockResolvedValueOnce(mockSuccessfullSecondResponse)

        const data = await getAllPaginatedData('test.com');

        expect(doRequest).toHaveBeenCalledTimes(2)
        expect(doRequest).toHaveBeenNthCalledWith(1,
            "test.com",
            {
                "page": 1,
            }
        )
        expect(doRequest).toHaveBeenNthCalledWith(2,
            "test.com",
            {
                "page": 2,
            }
        )

        expect(data).toEqual({error: null, data: ["hello", "world", "and", "again"]})
    })

    it('should handle errors if the first response fails', async () => {
        vi.mocked(doRequest).mockResolvedValueOnce({ok: false, data: []})


        const data = await getAllPaginatedData('test.com');

        expect(data).toEqual({error: 'something has gone wrong', data: []})
    })

    it('should handle errors if a request after the first fails', async () => {
        vi.mocked(doRequest).mockResolvedValueOnce(mockSuccessfullResponse)
        vi.mocked(doRequest).mockResolvedValueOnce({ok: false, data: []})


        const data = await getAllPaginatedData('test.com');

        expect(data).toEqual({error: "request data is incomplete", data: ["hello", "world"]})
    })
})