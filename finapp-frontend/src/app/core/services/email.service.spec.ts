import { TestBed } from '@angular/core/testing';
import { EmailService, Email } from './email.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('EmailService', () => {
    let service: EmailService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EmailService]
        });

        service = TestBed.inject(EmailService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should send email via POST', () => {
        const testEmail: Email = {
            from: 'example@example.com',
            subject: 'Hello',
            body: 'This is a test email.'
        };

        service.sendEmail(testEmail).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://localhost:3000/send-email');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ email: testEmail });
        req.flush({ success: true });
    });
});
