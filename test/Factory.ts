import Axios from "axios"
import { getLogger } from "../src/server/Logger"
const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, "")

const log = getLogger("Factory")

export default class Factory {
    static async getUserAmeToken() {
        const data = formUrlEncoded({
            grant_type: "password",
            username: "fabio.oshiro@gmail.com",
            password: "c@lindra123",
        })
        const userTokenPromise = Axios.post("https://api.dev.amedigital.com/api/auth/oauth/token", data, {
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic NDBiNGE3MGYtMDg5Ni00YjkwLWEyYTgtYTAzZWU3ZDUwZDI5OmJwYXlpb3NAMTIz",
            },
        })
        userTokenPromise.catch((err) => log.error(err))
        const userToken = await userTokenPromise
        const token = userToken.data.access_token
        return token
    }

    static getBlindToken() {
        return Axios.post("https://miniapps.dev.amedigital.com/blind-guardian/v1/o/auth", {
            grant_type: "client_credentials",
            client_id: "dbd3e153-414f-4d56-b448-14add66e52ab",
            client_secret: "0604ac09-ec84-43de-90bb-5e7b30ceef8f",
        }).then((res) => res.data.accessToken)
    }
}
