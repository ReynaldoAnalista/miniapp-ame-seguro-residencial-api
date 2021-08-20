export interface DataToSendMail {
    securityName?: string
    securityUserCpf?: string
    securityAddress?: string
    securityAddressNumber?: string
    securityAddressDistrict?: string
    securityAddressCity?: string
    securityAddressUf?: string
    securityDataUserCep?: string

    SecurityRepresentationSocialReazon?: string
    SecurityRepresentationCnpj?: string
    SecurityRepresentationCodSusep?: string

    securityDataSocialReazon?: string
    securityDataCpf?: string

    brokerName?: string
    brokerCodSusep?: string

    securyDataBranch?: string
    securyDataIndividualTicket?: string
    securyDataEmissionDate?: string
    securyDataInitialSuranceTerm?: string
    securyDataFinalSuranceTerm?: string

    glassProtectMaxLimit?: string
    glassProtectPos?: string
    glassProtectCoverPrize?: string
    glassProtectCarency?: string

    maxLimitThieft?: string
    posThieft?: string
    prizeThieft?: string
    lackThieft?: string
    maxLimitAcidental?: string
    posAcidental?: string
    prizeAcidental?: string
    lackAcidental?: string
    productDescription?: string
    model?: string
    mark?: string
    paymentForm?: string
    liquidPrice?: string
    iof?: string
    totalPrize?: string
    securyDataRepresentation?: string
    carencyThief?: string
    carencyBroken?: string
    carencyAcident?: string
}
