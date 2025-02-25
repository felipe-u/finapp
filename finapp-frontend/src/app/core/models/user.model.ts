import { Client } from "./client.model";

export class User {
    constructor(
        public _id: string,
        public name: string,
        public role: 'admin' | 'manager' | 'assistant',
        public email: string,
        public password: string,
        public phone: string,
    ) { }
}

export class Admin extends User {
    constructor(
        _id: string,
        name: string,
        role: 'admin',
        email: string,
        password: string,
        phone: string,
    ) {
        super(_id, name, role, password, phone, email);
    }
}

export class Manager extends User {
    constructor(
        _id: string,
        name: string,
        role: 'manager',
        email: string,
        password: string,
        phone: string,
    ) {
        super(_id, name, role, password, phone, email);
    }
}


export class Assistant extends User {
    constructor(
        _id: string,
        name: string,
        role: 'assistant',
        email: string,
        password: string,
        phone: string,
    ) {
        super(_id, name, role, password, phone, email);
    }
}
