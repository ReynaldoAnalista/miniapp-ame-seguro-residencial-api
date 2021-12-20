import { inject, injectable } from "inversify"
import { getLogger } from "../../../server/Logger"
import { LifeProposalUtil } from "./LifeProposalUtil"

import path from "path"
import util from "util"
import fs from "fs"

const readFile = util.promisify(fs.readFile)
const log = getLogger("LifeProposalService")

@injectable()
export class LifeProposalService {
    constructor(@inject("LifeProposalUtil") private lifeProposalUtil: LifeProposalUtil) {}

    async cotation(request: any) {
        const cotation = await readFile(path.resolve(__dirname, "../../../files/health_care_cotation.json"), "utf-8")
        const cotationObject = JSON.parse(cotation)
        const finalCotation = cotationObject
            .filter((x) => request.age >= x.min && request.age <= x.max)
            .map((x) => {
                return {
                    voce: (x.morte * request.range + x.ipa * request.range + x.diha + x.funeral + x.sorteio_liquido).toFixed(2),
                    familia: (
                        x.morte / 2 +
                        x.morte * request.range +
                        x.ipa * request.range +
                        x.diha +
                        x.funeral +
                        x.sorteio_liquido
                    ).toFixed(2),
                }
            })
        return finalCotation
    }

    async luckNumber() {
        return
    }
}
