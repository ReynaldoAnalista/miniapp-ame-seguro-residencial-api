import { inject, injectable } from "inversify"
import { ParameterStore } from "../../../configs/ParameterStore"
import { getLogger } from "../../../server/Logger"
import { CronJob } from "cron"
import { LifeProposalService } from "../services/LifeProposalService"

const logger = getLogger("lifeCronService")

@injectable()
export class lifeCronService {
    constructor(
        @inject("LifeProposalService")
        private lifeProposalService: LifeProposalService
    ) {}

    async startCronJobs() {
        logger.info("startCronJobs.start")
        const sendMultipleMail = await this.lifeProposalService.sendAutomaticMail()
        const job = new CronJob(
            "* * 6 * * *",
            function () {
                return sendMultipleMail
            },
            null,
            true,
            "America/Sao_Paulo"
        )
        job.start()
        logger.info("startCronJobs.end")
    }
}
