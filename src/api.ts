const ACCESS_TOKEN_NAMESPACE = "accessToken";

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

export const fetchSecured = async <R>(
  url: string,
  init: RequestInit = {}
): Promise<R> => {
  const storageToken = localStorage.getItem(ACCESS_TOKEN_NAMESPACE);
  const queryParamToken = getQueryParameters()[ACCESS_TOKEN_NAMESPACE];
  const token = queryParamToken ? queryParamToken : storageToken;
  if (queryParamToken) {
    localStorage.setItem(ACCESS_TOKEN_NAMESPACE, queryParamToken);
    window.history.replaceState(null, null, window.location.pathname);
  }
  const withAuth = addTokenHeader(token);
  return await fetchJson(url, withAuth(init));
};

export const fetchJson = async <R>(
  url: string,
  init: RequestInit = {}
): Promise<R> => {
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

export const getQueryParameters = () => {
  const queryStringKeyValue = window.location.search
    .replace("?", "")
    .split("&");
  return queryStringKeyValue.reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

export const fetchFn = Object.keys(getQueryParameters()).length
  ? fetchSecured
  : fetchJson;
