import { Client } from "./client.model";
import { Debtor } from "./debtor.model";

export class User {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public password: string,
        public phone: string,
        public role: 'admin' | 'manager' | 'assistant',
    ) { }
}

export class Admin extends User {
    constructor(
        _id: string,
        name: string,
        email: string,
        password: string,
        phone: string,
    ) {
        super(_id, name, email, password, phone, 'admin');
    }
}

export class Manager extends User {
    constructor(
        _id: string,
        name: string,
        email: string,
        password: string,
        phone: string,
        public debtors: Debtor[]
    ) {
        super(_id, name, email, password, phone, 'admin');
    }
}


export class Assistant extends User {
    constructor(
        _id: string,
        name: string,
        email: string,
        password: string,
        phone: string,
    ) {
        super(_id, name, email, password, phone, 'admin');
    }
}
