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
import { UsersComponent } from "../../features/users/users.component";
import { routes as AuthRoutes } from "./auth.routes";
import { routes as ClientRoutes } from "./client.routes";
import { routes as UserRoutes } from "./user.routes";
import { authGuard, authRedirectGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";

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
                path: 'users',
                component: UsersComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: 'FinApp | Users',
                children: UserRoutes
            },
            {
                path: 'clients',
                component: ClientsComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'manager' },
                title: 'FinApp | Clients',
                children: ClientRoutes
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
                path: 'profile',
                component: AccountComponent,
                title: 'Profile'
            },
            {
                path: 'settings',
                component: SettingsComponent,
                title: 'Settings'
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: '404 | Not Found'
    }
]