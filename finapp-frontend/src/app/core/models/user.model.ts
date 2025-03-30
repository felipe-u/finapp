export class User {
    constructor(
        public _id: string,
        public name: string,
        public role: 'admin' | 'manager' | 'assistant',
        public email: string,
        public password: string,
        public phone: string,
        public language: string,
        public photo?: string,
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
        language: string,
        photo?: string,
    ) {
        super(_id, name, role, email, password, phone, language, photo);
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
        language: string,
        photo?: string,
    ) {
        super(_id, name, role, email, password, phone, language, photo);
    }
}


export class Assistant extends User {
    constructor(
        _id: string,
        name: string,
        role: 'assistant',
        email: string,
        password: string,
        language: string,
        phone: string,
        photo?: string
    ) {
        super(_id, name, role, email, password, phone, language, photo);
    }
}
