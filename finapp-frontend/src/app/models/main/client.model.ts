import { Identification } from "../secundary/identification.model";
import { CommercialInfo } from "./commercialInfo.model";
import { GeoInfo } from "./geoInfor.model";
import { PersonalInfo } from "./personalInfo.model";


export class Client {
    constructor(
        public _id: string,
        public name: string,
        public identification: Identification,
        public personalInfo: PersonalInfo,
        public geoInfo: GeoInfo,
        public commercialInfo: CommercialInfo,
    ) { }
}