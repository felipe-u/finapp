import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Email {
    from: string;
    subject: string;
    body: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
    private httpClient = inject(HttpClient);
    private SERVER_URL = environment.SERVER_URL;

    sendEmail(email: Email) {
        return this.httpClient.post(
            this.SERVER_URL + '/send-email', { email }
        );
    }

}