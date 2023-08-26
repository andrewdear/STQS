export type Method = 'POST' | 'GET'

export type InputOptions = {
    page?: number;
    token?: string
    body?: Record<string, string>
    method?: Method
}