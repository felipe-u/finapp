export class Product {
    constructor(
        public _id: string,
        public brand: string,
        public model: string,
        public licensePlate?: string
    ) { }
}