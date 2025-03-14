import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UsersService } from "../services/users.service";

export const RoleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const usersService = inject(UsersService);
    const userRole = usersService.getUserRole();
    const expectedRole = route.data.expectedRole;

    if (userRole() === expectedRole) {
        return true;
    } else {
        router.navigate(['/home']);
        return false;
    }
}