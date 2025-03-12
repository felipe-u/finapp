import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { ClientsComponent } from "./features/clients/clients.component";
import { ReportsComponent } from "./features/reports/reports.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { AccountLayoutComponent } from "./layouts/account-layout/account-layout.component";
import { AccountComponent } from "./features/account/account.component";
import { SettingsComponent } from "./features/account/settings/settings.component";
import { SupportComponent } from "./features/support/support.component";
import { routes as ClientRoutes } from "./features/clients/clients.routes";
import { ClientComponent } from "./features/clients/client/client.component";
import { UsersComponent } from "./features/users/users.component";
import { UserComponent } from "./features/users/user/user.component";
import { DebtorsListComponent } from "./features/users/user/debtors-list/debtors-list.component";
import { routes as AuthRoutes } from "./shared/auth/auth.routes";

export const routes: Routes = [
    {
        path: 'auth',
        // authRedirectGuard
        children: AuthRoutes
    },
    {
        path: '',
        // authGuard
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                title: 'FinApp | Home'
            },
            {
                path: 'clients',
                component: ClientsComponent,
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
                title: 'FinApp | Users'
            },
            {
                path: 'users/:userId',
                component: UserComponent,
                title: 'FinApp | User',
            },
            {
                path: 'users/:userId/debtors-list',
                component: DebtorsListComponent,
                title: 'FinApp | Debtors List'
            },
            {
                path: 'reports',
                component: ReportsComponent,
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