import { inject } from "@angular/core";
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { UsersService } from "../services/users.service";

export function roleGuardFn(
    usersService: UsersService,
    router: Router,
    route: ActivatedRouteSnapshot
): boolean {
    const userRole = usersService.getUserRole();
    const expectedRole = route.data['expectedRole'];

    if (userRole() === expectedRole) {
        return true;
    } else {
        router.navigateByUrl('/forbidden');
        return false;
    }
}

export const RoleGuard: CanActivateFn = (route, state) =>
    roleGuardFn(inject(UsersService), inject(Router), route);
