import { Routes } from "@angular/router";
import { RoleGuard } from "../guards/role.guard";
import { authGuard, authRedirectGuard } from "../guards/auth.guard";
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
import { ProfileComponent } from "../../features/account/profile/profile.component";
import { ContactComponent } from "../../features/support/contact/contact.component";
import { routes as ClientRoutes } from "./clients.routes";
import { routes as AuthRoutes } from "./auth.routes";
import { ROUTE_PATHS, ROUTE_TITLES } from "../utils/app.routes.constants";

export const routes: Routes = [
    {
        path: ROUTE_PATHS.AUTH,
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
                path: ROUTE_PATHS.HOME,
                component: HomeComponent,
                title: ROUTE_TITLES.HOME
            },
            {
                path: ROUTE_PATHS.CLIENTS,
                component: ClientsComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'manager' },
                title: ROUTE_TITLES.CLIENTS,
            },
            {
                path: ROUTE_PATHS.CLIENT_DETAILS,
                component: ClientComponent,
                children: ClientRoutes
            },
            {
                path: ROUTE_PATHS.USERS,
                component: UsersComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: ROUTE_TITLES.USERS
            },
            {
                path: ROUTE_PATHS.USER_DETAILS,
                component: UserComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: ROUTE_TITLES.USER,
            },
            {
                path: ROUTE_PATHS.DEBTORS_LIST,
                component: DebtorsListComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'admin' },
                title: ROUTE_TITLES.DEBTORS_LIST
            },
            {
                path: ROUTE_PATHS.REPORTS,
                component: ReportsComponent,
                canActivate: [RoleGuard],
                data: { expectedRole: 'assistant' },
                title: ROUTE_TITLES.REPORTS
            },
            {
                path: ROUTE_PATHS.SUPPORT,
                component: SupportComponent,
                title: ROUTE_TITLES.SUPPORT
            },
            {
                path: ROUTE_PATHS.SUPPORT_CONTACT,
                component: ContactComponent,
                title: ROUTE_TITLES.SUPPORT
            }
        ]
    },
    {
        path: ROUTE_PATHS.ACCOUNT,
        component: AccountLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: ROUTE_PATHS.USER_ID,
                component: AccountComponent,
                title: ROUTE_TITLES.ACCOUNT,
                children: [
                    {
                        path: ROUTE_PATHS.ACCOUNT_PROFILE,
                        component: ProfileComponent,
                        title: ROUTE_TITLES.PROFILE
                    },
                    {
                        path: ROUTE_PATHS.ACCOUNT_SETTINGS,
                        component: SettingsComponent,
                        title: ROUTE_TITLES.SETTINGS
                    }
                ]
            },
        ]
    },
    {
        path: ROUTE_PATHS.FORBIDDEN,
        component: ForbiddenComponent,
        title: ROUTE_TITLES.FORBIDDEN
    },
    {
        path: ROUTE_PATHS.NOT_FOUND,
        component: NotFoundComponent,
        title: ROUTE_TITLES.NOT_FOUND
    }
]