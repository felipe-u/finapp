import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { DebtorsListComponent } from './user/debtors-list/debtors-list.component';

export const routes: Routes = [
    {
        path: '',
        component: UserComponent,
    },
    {
        path: 'debtors-list',
        component: DebtorsListComponent
    }
]