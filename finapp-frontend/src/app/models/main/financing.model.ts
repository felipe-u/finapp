import { Product } from "../secundary/product.model";
import { Installment } from "./installment.model";

export class Financing {
    constructor(
        public _id: string,
        public installments: Installment[],
        public installmentQuantity: number,
        public initialInstallment: Number,
        public product: Product,
        public totalPrice: number,
        public status: string
    ) { }
}