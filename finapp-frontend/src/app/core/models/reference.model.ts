import { Address } from "./address.model";


export class Reference {
    constructor(
        public name: string,
        public phone: string,
        public address: Address,
        public relationship: string
    ) { }
}