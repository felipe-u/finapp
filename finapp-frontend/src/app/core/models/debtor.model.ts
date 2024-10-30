import { Codebtor } from "./codebtor.model";
import { CommercialInfo } from "./commercialInfo.model";
import { Financing } from "./financing.model";
import { GeoInfo } from "./geoInfor.model";
import { Identification } from "./identification.model";
import { PersonalInfo } from "./personalInfo.model";

export class Debtor {
    constructor(
        public _id: string,
        public name: string,
        public identification: Identification,
        public personalInfo: PersonalInfo,
        public geoInfo: GeoInfo,
        public commercialInfo: CommercialInfo,
        public codebtor: Codebtor,
        public financing: Financing,
    ) { }
}