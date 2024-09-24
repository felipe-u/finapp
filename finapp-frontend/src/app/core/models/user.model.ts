import { Client } from "./client.model";

export class User {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: 'admin' | 'gestor' | 'auxiliar',
        public clients?: Client[] 
    ) { }
}