export class Plan {
    id?: string;
    description?: string;
    premium?: number;
    coverageList?: Array<Coverage>;

    public static fromObject(object: any): Plan {
        let newPlan = new Plan()
        newPlan.id = object.id
        newPlan.description = object.descricao
        newPlan.premium = object.premio
        if (object.coberturas && object.coberturas.length) {
            newPlan.coverageList = object.coberturas.map(c => {
                let coverage = new Coverage()
                coverage.id = c.id
                coverage.description = c.descricao
                coverage.value = c.valor
                coverage.DAPercent = c.percentualDA
                coverage.tax = c.taxa
                coverage.premium = c.premio
                coverage.deductiblePercent = c.percentualFranquia
                coverage.minDeductibleValue = c.valorLimiteFranquiaMinimo
                return coverage
            })
        }
        return newPlan
    }

    public toObject() {
        let outputObject = {
            id: this.id,
            descricao: this.description,
            premio: this.premium
        }

        if (this.coverageList) {
            outputObject['coberturas'] = this.coverageList.map(x => ({
                id: x.id,
                descricao: x.description,
                valor: x.value,
                percentualDA: x.DAPercent,
                taxa: x.tax,
                premio: x.premium,
                percentualFranquia: x.deductiblePercent,
                valorLimiteFranquiaMinimo: x.minDeductibleValue
            }))
        }
        return outputObject
    }
}

export class Coverage {
    id?: string;
    description?: string;
    DAPercent?: number;
    value?: number;
    tax?: number;
    premium?: number;
    deductiblePercent?: number;
    minDeductibleValue?: number;
}
