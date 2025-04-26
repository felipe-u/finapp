import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service"
import { Router } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;
    const SERVER_URL = environment.SERVER_URL;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: spy }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    })

    it("should create", () => {
        expect(service).toBeTruthy();
    })

    it('should save token on successful login', () => {
        const mockResponse = {
            token: 'mock-token',
            expiresIn: 3600
        };

        service.login('test@example.com', '123456').subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(localStorage.getItem('ACCESS_TOKEN')).toBe('mock-token');
        expect(localStorage.getItem('EXPIRES_IN')).toBeTruthy();
    });

    it('should save token on successful register', () => {
        const mockResponse = {
            token: 'mock-token',
            expiresIn: 3600
        };

        const mockUser = {
            email: 'test@example.com',
            password: '123456'
        };

        service.register(mockUser as any).subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/auth/register`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(localStorage.getItem('ACCESS_TOKEN')).toBe('mock-token');
    });

    it('should clear localStorage and navigate on logout', () => {
        localStorage.setItem('ACCESS_TOKEN', 'mock-token');
        localStorage.setItem('EXPIRES_IN', new Date(Date.now() + 3600000).toISOString());

        service.logout();

        expect(localStorage.getItem('ACCESS_TOKEN')).toBeNull();
        expect(localStorage.getItem('EXPIRES_IN')).toBeNull();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });

    it('should return false if token does not exist', () => {
        expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return false if token is expired', () => {
        const expired = new Date(Date.now() - 1000);
        localStorage.setItem('ACCESS_TOKEN', 'mock-token');
        localStorage.setItem('EXPIRES_IN', expired.toISOString());

        const freshService = TestBed.inject(AuthService);
        expect(freshService.isAuthenticated()).toBeFalse();
    });
})