import { tokenStorage } from "./tokenStorage";

const addHeaders =
    (customHeaders: Record<string, string>) =>
    ({ headers, ...req }: RequestInit) => ({
        ...req,
        headers: {
            ...headers,
            ...customHeaders,
        },
    });

const addTokenHeader = (token: string) => addHeaders({ Authorization: `Bearer ${token}` });

const withContentType = addHeaders({ "Content-Type": "application/json" });

const getAuthHeader = async (init: RequestInit): Promise<RequestInit> => {
    try {
        const token = await tokenStorage.getToken();
        const withAuth = addTokenHeader(token);
        return withAuth(init);
    } catch {
        return init;
    }
};

export const fetchSecured = async <R>(url: string, init: RequestInit = {}): Promise<R> => {
    const options = await getAuthHeader(init);
    return await fetchJson(url, options);
};

export const fetchJson = async <R>(url: string, init: RequestInit = {}): Promise<R> => {
    const response = await fetch(url, withContentType(init));

    let json: R & { error?: unknown; message?: unknown };

    try {
        json = await response.json();
    } catch {
        return;
    }

    if (!response.ok || json.error) {
        throw json.message || json.error;
    }
    return json as R;
};

export const localStorageToken = (namespace = "accessToken") => {
    let token: string;
    const url = new URL(window.location.href);
    if (url.searchParams.has(namespace)) {
        token = url.searchParams.get(namespace);
        localStorage.setItem(namespace, token);
        url.searchParams.delete(namespace);
        window.history.replaceState(null, null, url.toString());
    } else {
        token = localStorage.getItem(namespace);
    }
    return token ? Promise.resolve(token) : Promise.reject();
};

export const fetchFn = fetchSecured;
