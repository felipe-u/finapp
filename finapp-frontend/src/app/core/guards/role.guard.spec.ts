import { roleGuardFn } from './role.guard';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';
import { signal } from '@angular/core';

describe('roleGuardFn', () => {
    let usersServiceSpy: jasmine.SpyObj<UsersService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let mockRoute: Partial<ActivatedRouteSnapshot>;

    beforeEach(() => {
        usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUserRole']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        mockRoute = {
            data: { expectedRole: 'admin' }
        };
    });

    it('debería permitir acceso si el rol coincide', () => {
        usersServiceSpy.getUserRole.and.returnValue(signal('admin'));

        const result = roleGuardFn(usersServiceSpy, routerSpy, mockRoute as ActivatedRouteSnapshot);

        expect(result).toBeTrue();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('debería redirigir si el rol no coincide', () => {
        usersServiceSpy.getUserRole.and.returnValue(signal('user'));

        const result = roleGuardFn(usersServiceSpy, routerSpy, mockRoute as ActivatedRouteSnapshot);

        expect(result).toBeFalse();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    });
});
