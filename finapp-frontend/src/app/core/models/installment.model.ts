export class Installment {
    constructor(
        public _id: string,
        // Numero de cuota
        public installmentNumber: number,
        // Vencimiento de la cuota
        public dueDate: Date,
        // Capital
        public capital: number,
        // Intereses
        public interest: number,
        // Valor aval
        public guaranteeValue: number,
        // Interes causado
        public accruedInterest: number,
        // Devolucion
        public refund: number,
        // Valor cuota
        public installmentValue: number,
        // Valor debe
        public outstandingValue: number,
        // Dias vencidos
        public overdueDays: number,
        // Total de intereses
        public totalInterest: number,
        // Total de la cuota
        public totalInstallment: number
    ) { }
}