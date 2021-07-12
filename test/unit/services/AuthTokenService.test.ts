import { AuthTokenService } from "../../../src/modules/authToken/services/AuthTokenService"

describe("AuthTokenService", () => {
    let authTokenService: AuthTokenService
    const conf = {
        CLIENT_ID: "ame-previsul",
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CLIENT_SCOPE: "hub.previsul",
        URL_AUTHORIZATION: "https://gateway.b2sky.io/hub-previsul/oauth/token",
    }

    beforeEach(() => {
        const parameterStore: any = {
            getSecretValue: (confName) => {
                return conf[confName]
            },
        }
        authTokenService = new AuthTokenService(parameterStore)
    })

    it("should do the auth", async () => {
        const res = await authTokenService.retrieveAuthorization("SMARTPHONE")
        // console.log(res)
    })
})
