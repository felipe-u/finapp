export class PersonalInfo {
    constructor(
        public _id: string,
        public email: string,
        public phone: string,
        public birthDate: Date,
        public photo?: string,
    ) { }
}