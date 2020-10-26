import {injectable} from "inversify";
import {Get, Route} from "tsoa";

const fs = require('fs')
const path = require('path')

@Route('/health')
@injectable()
export class HealthController {
    private startupDate: Date

    constructor(
    ) {
        this.startupDate = new Date()
    }

    @Get()
    public async health() { 
        return {
            'message': 'I am Healthy',
            'startup': this.startupDate,
            'commitDate': await this.getCommitDate(),
            'commitHash': process.env.COMMIT_HASH || "unavailable"
        }
    }

    /**
     * Para automatizar a verificacao de build velho
     * rodando nos ambientes
     */
    private getCommitDate() {
        return new Promise((resolve, reject) => {
            try {
                let commitDateFile = path.join(__dirname, "../../../commit_date.txt")
                fs.readFile(commitDateFile, 'utf-8', (err, data) => {
                    if (err) {
                        return resolve("2001-01-01")
                    }
                    resolve(data.trim())
                })
            } catch (e) {
                resolve("2001-01-01")
            }
        })
    }

}
