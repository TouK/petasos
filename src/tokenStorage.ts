// Holds a getter resolving to a ready `Authorization` header value (`Bearer <token>`), replaced by the
// host app through RootProviders.
class TokenStorage {
    getAuthToken = () => this.authTokenGetter();

    constructor(private authTokenGetter: () => Promise<string> = () => Promise.reject()) {}

    replaceAuthTokenGetter(newGetter: () => Promise<string>): void {
        this.authTokenGetter = newGetter;
    }
}

export const tokenStorage = new TokenStorage();
