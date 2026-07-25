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

const addAuthorizationHeader = (authorization: string) => addHeaders({ Authorization: authorization });

const withContentType = addHeaders({ "Content-Type": "application/json" });

const getAuthHeader = async (init: RequestInit): Promise<RequestInit> => {
    try {
        const authorization = await tokenStorage.getAuthToken();
        const withAuth = addAuthorizationHeader(authorization);
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

// Fallback used when the host app does not pass its own `getAuthToken`. Reads the raw token from the
// sessionStorage entry shared with the host and returns a ready `Authorization` header value.
export const sessionStorageAuthToken = (namespace = "accessToken") => {
    let token: string;
    const url = new URL(window.location.href);
    if (url.searchParams.has(namespace)) {
        token = url.searchParams.get(namespace);
        sessionStorage.setItem(namespace, token);
        url.searchParams.delete(namespace);
        window.history.replaceState(null, null, url.toString());
    } else {
        token = sessionStorage.getItem(namespace);
    }
    return token ? Promise.resolve(`Bearer ${token}`) : Promise.reject();
};

export const fetchFn = fetchSecured;
