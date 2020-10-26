export class AuthToken {
    token?: string
    expiresIn?: number


    static fromObject(source: any): AuthToken {
        let auth = new AuthToken()
        return Object.assign(auth, source)
    }
}
