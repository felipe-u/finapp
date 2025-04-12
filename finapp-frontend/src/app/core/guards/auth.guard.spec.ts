import { authGuardFn, authRedirectGuardFn } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

describe('Auth Guards Functions (sin inject)', () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    });

    it('authGuardFn: permite acceso si autenticado', () => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        const result = authGuardFn(authServiceSpy, routerSpy);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('authGuardFn: redirige al login si no autenticado', () => {
        authServiceSpy.isAuthenticated.and.returnValue(false);
        const result = authGuardFn(authServiceSpy, routerSpy);
        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });

    it('authRedirectGuardFn: permite acceso si no autenticado', () => {
        authServiceSpy.isAuthenticated.and.returnValue(false);
        const result = authRedirectGuardFn(authServiceSpy, routerSpy);
        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('authRedirectGuardFn: redirige al home si autenticado', () => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        const result = authRedirectGuardFn(authServiceSpy, routerSpy);
        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/home');
    });
});
