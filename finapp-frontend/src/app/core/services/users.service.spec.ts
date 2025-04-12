import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('UsersService', () => {
    let service: UsersService;
    let httpMock: HttpTestingController;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot()
            ],
            providers: [UsersService, TranslateService]
        });

        service = TestBed.inject(UsersService);
        httpMock = TestBed.inject(HttpTestingController);
        translateService = TestBed.inject(TranslateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all users', () => {
        const mockUsers = [{ userId: '1', userName: 'John Doe' }, { userId: '2', userName: 'Jane Doe' }];

        service.getAllUsers().subscribe(users => {
            expect(users).toEqual(mockUsers);
        });

        const req = httpMock.expectOne('http://localhost:3000/users/all');
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);
    });

    it('should find user by ID', () => {
        const mockUser = { userId: '1', userName: 'John Doe' };

        service.findById('1').subscribe(user => {
            expect(user).toEqual(mockUser);
        });

        const req = httpMock.expectOne('http://localhost:3000/users/?userId=1');
        expect(req.request.method).toBe('GET');
        req.flush({ user: mockUser });
    });

    it('should update user info', () => {
        const userId = '1';
        const newEmail = 'john.doe@example.com';
        const newPhone = '123456789';

        service.updateUserInfo(userId, newEmail, newPhone).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://localhost:3000/user-update');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ userId, email: newEmail, phone: newPhone });
        req.flush({ success: true });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
