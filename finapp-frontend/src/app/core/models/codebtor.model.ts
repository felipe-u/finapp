import { CommercialInfo } from "./commercialInfo.model";
import { GeoInfo } from "./geoInfor.model";
import { Identification } from "./identification.model";
import { PersonalInfo } from "./personalInfo.model";

export class Codebtor {
    constructor(
        public _id: string,
        public name: string,
        public identification: Identification,
        public personalInfo: PersonalInfo,
        public geoInfo: GeoInfo,
        public commercialInfo: CommercialInfo,
    ) { }
}