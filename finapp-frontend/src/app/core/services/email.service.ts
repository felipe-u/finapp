import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Email {
    from: string;
    subject: string;
    body: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
    private httpClient = inject(HttpClient);
    private SERVER_URL = "http://localhost:3000/";

    sendEmail(email: Email) {
        return this.httpClient.post(this.SERVER_URL + 'send-email', { email })
    }

}