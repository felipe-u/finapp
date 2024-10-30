export enum idTypeEnum {
    CC = "Cedula de Ciudadania",
    CE = "Cedula de Extranjeria",
    NIT = "Numero de Identificacion Tributaria",
}

export class Identification {
    constructor(
        public idType: idTypeEnum,
        public number: string
    ) { }
}