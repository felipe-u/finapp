export class CommercialInfo {
    constructor(
        public _id: string,
        public jobOccupation: string,
        public company: string,
        public laborSenority: string,
        public income: number,
        public additionalIncome: number,
        public expenses: number,
    ) { }
}