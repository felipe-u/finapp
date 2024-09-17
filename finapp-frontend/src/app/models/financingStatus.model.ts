import { Installment } from "./installment.model";
import { Product } from "./product.model";

export class FinancingStatus {
    constructor(
        public _id: string,
        public installments: Installment[],
        public installmentQuantity: number,
        public initialInstallment: Number,
        public product: Product,
        public totalPrice: number,
    ) { }
}