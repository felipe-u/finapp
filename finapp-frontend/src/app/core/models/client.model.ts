import { CommercialInfo } from "./commercialInfo.model";
import { Financing } from "./financing.model";
import { GeoInfo } from "./geoInfo.model";
import { Identification } from "./identification.model";
import { PersonalInfo } from "./personalInfo.model";
import { Reference } from "./reference.model";

export class Client {
    constructor(
        public _id: string,
        public name: string,
        public role: 'debtor' | 'codebtor',
        public identification: Identification,
        public personalInfo: PersonalInfo,
        public geoInfo: GeoInfo,
        public commercialInfo: CommercialInfo,
        public financing: Financing,
        public references: Reference[]
    ) { }
}

export class Debtor extends Client {
    constructor(
        _id: string,
        name: string,
        role: 'debtor',
        identification: Identification,
        personalInfo: PersonalInfo,
        geoInfo: GeoInfo,
        commercialInfo: CommercialInfo,
        financing: Financing,
        references: Reference[],
        public codebtor: Codebtor
    ) {
        super(_id, name, role, identification,
            personalInfo, geoInfo, commercialInfo,
            financing, references);
    }
}

export class Codebtor extends Client {
    constructor(
        _id: string,
        name: string,
        role: 'codebtor',
        identification: Identification,
        personalInfo: PersonalInfo,
        geoInfo: GeoInfo,
        commercialInfo: CommercialInfo,
        financing: Financing,
        references: Reference[],
        public debtor: Debtor
    ) {
        super(_id, name, role, identification,
            personalInfo, geoInfo, commercialInfo,
            financing, references);
    }
}