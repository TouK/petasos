const addHeaders =
  (customHeaders: Record<string, string>) =>
  ({ headers, ...req }: RequestInit) => ({
    ...req,
    headers: {
      ...headers,
      ...customHeaders,
    },
  });

const addTokenHeader = (token: string) =>
  addHeaders({ Authorization: `Bearer ${token}` });

const withContentType = addHeaders({ "Content-Type": "application/json" });

export const fetchJson = async <R>(
  url: string,
  failIfResponseNotOk: boolean,
  init: RequestInit = {}
): Promise<R> => {
  const response = await fetch(url, withContentType(init));
  if (!response.ok && failIfResponseNotOk) {
    throw new Error("Not 2xx response");
  }
  let json: any;

  try {
    json = await response.json();
  } catch {
    return;
  }

  if (json.error) {
    throw json.message || json.error;
  }
  return json;
};

export function withToken(
  fetchFn: typeof fetchJson,
  tokenGetter: () => Promise<string>
): typeof fetchJson {
  return async (url, failIfResponseNotOk, init = {}) => {
    const token = await tokenGetter();
    const withAuth = addTokenHeader(token);
    return await fetchFn(url, false, withAuth(init));
  };
}

// this is the fetch function used in store, so far no authorization is in use,
// this should be addressed in the future

export const fetchFn = fetchJson;
