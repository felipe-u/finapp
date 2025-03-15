import { Routes } from "@angular/router";
import { HomeComponent } from "../../features/home/home.component";
import { ClientsComponent } from "../../features/clients/clients.component";
import { ReportsComponent } from "../../features/reports/reports.component";
import { NotFoundComponent } from "../../shared/not-found/not-found.component";
import { MainLayoutComponent } from "../../layouts/main-layout/main-layout.component";
import { AccountLayoutComponent } from "../../layouts/account-layout/account-layout.component";
import { AccountComponent } from "../../features/account/account.component";
import { SettingsComponent } from "../../features/account/settings/settings.component";
import { SupportComponent } from "../../features/support/support.component";
import { ClientComponent } from "../../features/clients/client/client.component";
import { UsersComponent } from "../../features/users/users.component";
import { UserComponent } from "../../features/users/user/user.component";
import { DebtorsListComponent } from "../../features/users/user/debtors-list/debtors-list.component";
import { ForbiddenComponent } from "../../shared/forbidden/forbidden.component";
import { routes as ClientRoutes } from "./clients.routes";
import { routes as AuthRoutes } from "./auth.routes";
import { authGuard, authRedirectGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { ProfileComponent } from "../../features/account/profile/profile.component";

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [authRedirectGuard],
        children: AuthRoutes
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent,
                title: 'FinApp | Home'
            },
            {
                path: 'clients',
                component: ClientsComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'manager' },
                title: 'FinApp | Clients',
            },
            {
                path: 'clients/:clientId',
                component: ClientComponent,
                children: ClientRoutes
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: 'FinApp | Users'
            },
            {
                path: 'users/:userId',
                component: UserComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: 'FinApp | User',
            },
            {
                path: 'users/:userId/debtors-list',
                component: DebtorsListComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: 'FinApp | Debtors List'
            },
            {
                path: 'reports',
                component: ReportsComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'assistant' },
                title: 'FinApp | Reports'
            },
            {
                path: 'support',
                component: SupportComponent,
                title: 'FinApp | Support'
            }
        ]
    },
    {
        path: 'account',
        component: AccountLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: ':userId',
                component: AccountComponent,
                title: 'Account Settings',
                children: [
                    {
                        path: 'profile',
                        component: ProfileComponent,
                        title: 'Profile'
                    },
                    {
                        path: 'settings',
                        component: SettingsComponent,
                        title: 'Settings'
                    }
                ]
            },
        ]
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent,
        title: '403 | Forbidden'
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: '404 | Not Found'
    }
]