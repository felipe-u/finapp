import { Client } from "./client.model";
import { Financing } from "./financing.model";
import { Reference } from "./reference.model";

export class CommercialInfo {
    constructor(
        public _id: string,
        public jobCccupation: string,
        public company: string,
        public laborSenority: string,
        public income: number,
        public additionalIncome: number,
        public expenses: number,
        public references: Reference[]
    ) { }
}