import { inject, injectable } from "inversify"
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
        const job = new CronJob(
            "0 1 * * *",
            async () => {
                await this.lifeProposalService.sendAutomaticMail()
            },
            null,
            true,
            "America/Sao_Paulo"
        )
        job.start()
        logger.info("startCronJobs.end")
    }
}
