import { Debtor } from "./debtor.model";
import { Assistant } from "./user.model";

export class Report {
    constructor(
        public _id: string,
        public reportType: 'debtor' | 'latePayment' | 'general',
        public assistant: Assistant
    ) { }
}

export class DebtorReport extends Report {
    constructor(
        _id: string,
        asisstant: Assistant,
        public debtor: Debtor
    ) {
        super(_id, 'debtor', asisstant);
    }
}

export class LatePaymentReport extends Report {
    constructor(
        _id: string,
        assistant: Assistant,
        public overDueDays: number,
    ) {
        super(_id, 'latePayment', assistant);
    }
}

export class GeneralReport extends Report {
    constructor(
        _id: string,
        assistant: Assistant,
    ) {
        super(_id, 'general', assistant);
    }
}