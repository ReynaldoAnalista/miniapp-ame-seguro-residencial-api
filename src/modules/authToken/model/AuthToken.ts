export class AuthToken {
    access_token?: string
    token_type?: string
    scope?: string
    jti?: string
    expires_in?: number

    static fromObject(source): AuthToken {
        const auth = new AuthToken()
        return Object.assign(auth, source)
    }
}
