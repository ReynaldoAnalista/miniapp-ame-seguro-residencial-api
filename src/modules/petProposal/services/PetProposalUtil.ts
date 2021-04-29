import { inject, injectable } from "inversify";
import moment from "moment";
import { getLogger } from "../../../server/Logger";

const log = getLogger("PetProposalUtil");

@injectable()
export class PetProposalUtil {

    async formatRequestProposal(proposal: any) {
        return {            
            payment: { id_opcao_pagamento: 1 },
            insurance_holder: proposal.attributes?.customPayload.proposal.insurance_holder,
            pets: proposal.attributes?.customPayload.proposal.pets.map(pet => {
                return {
					namePet: pet.namePet,
					birthDatePet: moment(pet.birthDatePet, "DDMMYYYY").format("YYYY-MM-DD"),
					color: pet.color,
					age: parseInt(pet.age),
					gender: pet.gender,
					size: pet.size,
					description: pet.description,
					vaccined: pet.vaccined,
					preexisting_condition: pet.preexisting_condition,
					species: pet.species,
					breed: pet.bread
				}
            })
        }
    }

    async formatDatabaseProposal(quoteId : string, quoteProposal: any, requestProposal: any) {
        return {
            id: quoteId,
            date: moment().format('DD-MM-YYYY hh:mm:ss'),
            quoteProposal: quoteProposal,
            enrollProposal: requestProposal,
            status: requestProposal.data == "Success" ? true : false
        }
    }

    async formatQuoteProposal(customPayload: any) {
        var productId : number = 0;
        try {
            var petsBirthDate = customPayload.proposal.pets.map((prop) => {
                return {
                    age: typeof(prop.age) == "undefined" ? moment().diff(moment(prop.birthDatePet, "DDMMYYYY"), 'years') : Number(prop.age),
                    name: prop.namePet,
                    size: prop.size,
                    breed: prop.breed,
                    color: prop.color,
                    gender: prop.gender,
                    species: prop.species,
                    vaccined: prop.vaccined,
                    preexisting_condition: prop.preexisting_condition,
                    birth_date: moment(prop.birthDatePet, "DDMMYYYY").format("YYYY-MM-DD"),                    
                };
            });
            if (customPayload.ambiente === "prod") {
                switch (customPayload.proposal.planId) {
                    case 48:
                        var productId = 33;
                        break;
                    case 49:
                        var productId = 34;
                        break;
                    case 50:
                        var productId = 35;
                        break;
                }
            } else {
                switch (customPayload.proposal.planId) {
                    case 46:
                        var productId = 28;
                        break;
                    case 47:
                        var productId = 29;
                        break;
                    case 48:
                        var productId = 30;
                        break;
                }
            }
            return {
                pets: petsBirthDate,
                product_ids: [productId],
            };
        } catch (e) {
            log.debug("Format Proposal error: " + e.message);
        }
    }

}