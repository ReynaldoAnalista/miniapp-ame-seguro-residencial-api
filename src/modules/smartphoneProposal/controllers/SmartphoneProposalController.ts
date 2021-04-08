import {inject, injectable} from "inversify"
import {SmartphoneProposalService} from "../services/SmartphoneProposalService"
import {Get, Path, Route, SuccessResponse, Response, Post, Body, Security} from "tsoa"
import {getLogger} from "../../../server/Logger"
import {ApiError} from "../../../errors/ApiError";
import { DigibeeConfirmation } from "../model/DigibeeConfirmation";
import { SmartphoneProposalNotification} from "../model/SmartphoneProposalNotification";
import { SmartphoneProposalMailService } from "../services/SmartphoneProposalMailService";

const logger = getLogger("SmartphoneProposalController")

@Route('/v1/smartphone')
@injectable()
export class SmartphoneProposalController {
    constructor(
        @inject("SmartphoneProposalService") private planService: SmartphoneProposalService,
        @inject("SmartphoneProposalMailService") private smartphoneProposalMailService: SmartphoneProposalMailService,
    ) {
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/sendProposal")
    public async sendProposal(@Body() signedPayment: SmartphoneProposalNotification) {
        logger.info('Sending Proposal %j', signedPayment);
        try {
            return await this.planService.processProposal(signedPayment.signedPayment)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Plans not sent", 500, `Plans not sent`)
        }
    }
        
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/updateProposal/{proposalId}")
    public async updateProposal(@Path() proposalId: string) {
        logger.info('Proposal Id %j', proposalId);
        try {
            return await this.planService.updateProposal(proposalId)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }

        
    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/update_many_proposal")
    public async updateManyProposal(@Body() proposal: any) {
        logger.info('Enviando várias propostas para atualização');
        try {
            return await this.planService.updateManyProposal(proposal)
        } catch (e) {
            logger.error(e.message)
            throw new ApiError("Update not sent", 500, `Update not sent`)
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/proposal/{pass}/sendEmail")
    public async sendMailProposal(@Path() pass: string) {
        try {
            logger.info('E-mail com o id de compra:', pass)
            await this.planService.sendSellingEmail(pass)       
        } catch (e) {
            logger.error(e.message)            
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/proposal/{pass}/sendEmail/{email}")
    public async sendMailProposalToMe(@Path() pass: string, @Path() email: string) {
        try {
            logger.info('E-mail com o id de compra:', pass)
            await this.planService.sendSellingEmail(pass, email)
        } catch (e) {
            logger.error(e.message)
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/sold_proposal/{customerId}/{order}/statusUpdate")
    public async statusUpdateSoldProposal(@Path() customerId: string, order: string) {
        try {
            logger.info('Atualização do status SoldProposal com o Id da compra:', customerId)
            await this.planService.updateStatusSoldProposal(customerId, order)
        } catch (e) {
            logger.error(e.message)            
        }
    }

    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Get("/validate_email/{pass}")
    public async validateMailProposal(@Path() pass: string) {
        try {
            logger.info('Validação do e-mail com o id de compra:', pass)
            const validateProposal = await this.planService.validateMailProposal(pass)            
            logger.info('E-mail validado', validateProposal)
            return validateProposal
        } catch (e) {
            logger.error(e)            
        }
    }


    @Response(404, 'NotFound')
    @SuccessResponse("200", "Retrieved")
    @Post("/confirm_proposal")
    public async confirmProposal(@Body() digibeeConfirmation: DigibeeConfirmation) {
        try {
            logger.info('Validação da proposta pela DigiBee:')
            const validateProposal = await this.planService.confirmProposal(digibeeConfirmation)
            logger.info('Proposta validada', validateProposal)
            return validateProposal
        } catch (e) {
            logger.error(e)            
        }
    }

}
