import { Routes } from "@angular/router";
import { RoleGuard } from "../guards/role.guard";
import { UserComponent } from "../../features/users/user/user.component";
import { DebtorsListComponent } from "../../features/users/user/debtors-list/debtors-list.component";

export const routes: Routes = [
    {
        path: ':userId',
        component: UserComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
        title: 'FinApp | User',
    },
    {
        path: ':userId/debtors-list',
        component: DebtorsListComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'admin' },
        title: 'FinApp | Debtors List'
    }
]