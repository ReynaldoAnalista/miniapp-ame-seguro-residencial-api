import { inject, injectable } from "inversify";
import moment from "moment";
import { getLogger } from "../../../server/Logger";

const log = getLogger("PetProposalUtil");

@injectable()
export class PetProposalUtil {

    async formatRequestProposal(proposal: any) {
        return {            
            payment: {
                id_opcao_pagamento: 0
            },
            pets: proposal.customPayload.proposal.pets,
            insurance_holder: null
        }
    }

    async formatQuoteProposal(proposal: any) {
        var productId : number = 0;
        try {
            var petsBirthDate = proposal.pets.map((prop) => {
                return {
                    age: Number(prop.age),
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
            switch (proposal.planId) {
                case 48:
                    var productId = 30;
                    break;
                case 49:
                    var productId = 31;
                    break;
                case 50:
                    var productId = 32;
                    break;
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