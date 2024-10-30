import { statusEnum } from "./enums";
import { Installment } from "./installment.model";
import { Motorcycle } from "./motorcycle.model";

export class Financing {
    constructor(
        public _id: string,
        public status: statusEnum,
        public motorcycle: Motorcycle,
        public initialInstallment: number,
        public financedAmount: number,
        public numberOfInstallments: number,
        public totalToPay: number,
        public monthlyInterest: number,
        public lateInteres: number,
        public installments: Installment[]
    ) { }
}