import {doRequest} from "./do-request.ts";
import {InputOptions} from "./types.ts";

const requestsAllowedPerSecond = 2;

type Meta = { total: number, page: number, limit: number };

// Some of the requests have a few pages of paginated data. To be used only when sensible, will only work on array data
// For the type you pass in the type of a single array item that will be returned
export const getAllPaginatedData = async <T>(url: string, requestData: InputOptions = {}): Promise<{data:T[], error: string | null}> => {

    const firstRequest = await doRequest<{data: T[], meta: Meta}>(url, {...requestData, page: 1});

    if(!firstRequest.ok) {
        return {data: [], error: 'something has gone wrong'};
    }

    const data = firstRequest.data as {data: T[], meta: Meta};

    const metaData = data.meta;

    const pages = Math.ceil(metaData.total / metaData.limit);

    let allData = [...data.data];

    const promises = [];

    let hadErrors = false;

    for(let i = 2; i <= pages; i++) {
        promises.push(doRequest<T>(url, {...requestData, page: i}).then(({data, ok}) => {
            if(ok) {
                const newData = data as { data: T[], meta: Meta };
                allData = [...allData, ...newData.data];
            } else {
                hadErrors = true
            }
        }));

        // So we do not trigger any rate limiting, when we send of these requests we wait 1 second each time we meet the allowed requests per second
        if(i % requestsAllowedPerSecond === 0) {
            await new Promise((resolve => setTimeout(() => {resolve(true)} ,1000)))
        }
    }

    await Promise.all(promises);

    return {data: allData, error: hadErrors ? "request data is incomplete" : null};
}