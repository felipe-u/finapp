import { FundingStatus } from "./fundingStatus.model";

export class CommercialInfo {
    constructor(
        public _id: string,
        public occupation: string,
        public salary: string,
        public co_signerName: string,
        public co_signerPhone: string,
        public fundingStatus: FundingStatus,
    ) { }
}