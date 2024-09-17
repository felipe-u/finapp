export class Address {
    constructor(
        public country: string,
        public department: string,
        public city: string,
        public neighbourhood: string,
        public sector: string,
        public additionalInfo?: string
    ) { }
}