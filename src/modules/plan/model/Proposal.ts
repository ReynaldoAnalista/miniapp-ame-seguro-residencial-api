export class Proposal {
    comission?: number
    planId?: string
    name?: string
    document?: string
    gender?: string
    birthData?: string
    phone?: string
    mail?: string
    startDate?: string
    property?: Property

    toObject() {
        let outputObject = {
            comissao: this.comission,
            planoId: this.planId,
            nome: this.name,
            cpf: this.document,
            sexo: this.gender,
            dataNascimento: this.birthData,
            telefone: this.phone,
            email: this.mail,
            dataInicioVigencia: this.startDate,
        }
        if (this.property) {
            outputObject['imovel'] = {
                tipo: this.property.buildType,
                ocupacao: this.property.occupationType,
                construcao: this.property.buildType,
            }
            if (this.property.address) {
                outputObject['imovel']['address'] = {
                    cep: this.property.address.zipCode,
                    numero: this.property.address.number,
                    complemento: this.property.address.additionalInfo,
                }
            }
        }
    }
}

export class Property {
    propertyType?: number
    occupationType?: number
    buildType?: number
    address?: Address
}

export class Address {
    zipCode?: string
    number?: string
    additionalInfo?: string
}
