import { Installment } from "./installment.model";

export class FundingStatus {
    constructor(
        public _id: string,
        public installments: Installment[],
        public installmentQuantity: number,
        public product: string,
        public totalPrice: number,
    ) {}
}