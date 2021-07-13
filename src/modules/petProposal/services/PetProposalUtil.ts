import { inject, injectable } from "inversify"
import moment from "moment"
import { getLogger } from "../../../server/Logger"
import { Tenants } from "../../default/model/Tenants"

const log = getLogger("PetProposalUtil")

@injectable()
export class PetProposalUtil {
    async formatDatabaseSoldProposal(proposal: any, customerId: string) {
        return {
            customerId,
            order: proposal.id,
            tenant: Tenants.PET,
            receivedPaymentNotification: proposal.enrollProposal,
            partnerResponse: proposal.quoteProposal,
            success: proposal.enrollProposal.data == "Success" ? true : false,
            createdAt: moment().format("YYYY-MM-DD h:m:s"),
        }
    }

    async formatRequestProposal(proposal: any) {
        return {
            payment: { id_opcao_pagamento: 1 },
            insurance_holder: proposal.attributes?.customPayload.proposal.insurance_holder,
            pets: proposal.attributes?.customPayload.proposal.pets.map((pet) => {
                return {
                    name: pet.namePet,
                    species: pet.species,
                    breed: typeof pet.breed == "undefined" ? "" : pet.breed,
                    gender: pet.gender,
                    color: pet.color,
                    birth_date: moment(pet.birthDatePet, "DDMMYYYY").format("YYYY-MM-DD"),
                    size: pet.size,
                    preexisting_condition: pet.preexisting_condition,
                }
            }),
        }
    }

    async formatDatabaseProposal(quoteId: string, quoteProposal: any, requestProposal: any) {
        return {
            id: quoteId,
            date: moment().format("DD-MM-YYYY hh:mm:ss"),
            quoteProposal: quoteProposal,
            enrollProposal: requestProposal,
            status: requestProposal.data == "Success" ? true : false,
        }
    }

    async formatQuoteProposal(customPayload: any) {
        try {
            let productId = 0
            const petsBirthDate = customPayload.proposal.pets.map((prop) => {
                return {
                    age:
                        typeof prop.age == "undefined"
                            ? moment().diff(moment(prop.birthDatePet, "DDMMYYYY"), "years")
                            : Number(prop.age),
                    name: prop.namePet,
                    size: prop.size,
                    breed: prop.breed,
                    color: prop.color,
                    gender: prop.gender,
                    species: prop.species,
                    vaccined: prop.vaccined,
                    preexisting_condition: prop.preexisting_condition,
                    birth_date: moment(prop.birthDatePet, "DDMMYYYY").format("YYYY-MM-DD"),
                }
            })
            if (customPayload.ambiente === "prod") {
                switch (customPayload.proposal.planId) {
                    case 48:
                        productId = 33
                        break
                    case 49:
                        productId = 34
                        break
                    case 50:
                        productId = 35
                        break
                }
            } else {
                switch (customPayload.proposal.planId) {
                    case 46:
                        productId = 28
                        break
                    case 47:
                        productId = 29
                        break
                    case 48:
                        productId = 30
                        break
                }
            }
            return {
                pets: petsBirthDate,
                product_ids: [productId],
            }
        } catch (e) {
            log.debug("Format Proposal error: " + e.message)
        }
    }
}
