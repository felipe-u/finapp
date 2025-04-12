import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

export function authGuardFn(authService: AuthService, router: Router): boolean {
    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigateByUrl('/auth/login');
        return false;
    }
}

export const authGuard: CanActivateFn = () => authGuardFn(
    inject(AuthService),
    inject(Router)
);

export function authRedirectGuardFn(authService: AuthService, router: Router): boolean {
    if (authService.isAuthenticated()) {
        router.navigateByUrl('/home');
        return false;
    }
    return true;
}

export const authRedirectGuard: CanActivateFn = () => authRedirectGuardFn(
    inject(AuthService),
    inject(Router)
);
