export class TokenStorage {
    getToken = () => this.tokenGetter();

    constructor(private tokenGetter: () => Promise<string> = Promise.reject) {}

    replaceTokenGetter(newGetter: () => Promise<string>): void {
        this.tokenGetter = newGetter;
    }
}

export const tokenStorage = new TokenStorage();
