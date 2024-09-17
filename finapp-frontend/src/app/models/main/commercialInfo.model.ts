import { Reference } from "../secundary/reference.model";
import { Client } from "./client.model";
import { FinancingStatus } from "./financingStatus.model";

export class CommercialInfo {
    constructor(
        public _id: string,
        public clientType: 'deudor' | 'codeudor',
        public coDebtor: Client,
        public jobCccupation: string,
        public company: string,
        public laborSenority: string,
        public income: number,
        public additionalIncome: number,
        public expenses: number,
        public financingStatus: FinancingStatus[],
        public references: Reference[]
    ) { }
}