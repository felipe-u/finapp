import { Routes } from "@angular/router";
import { RegisterComponent } from "../../shared/auth/register/register.component";
import { LoginComponent } from "../../shared/auth/login/login.component";

export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    }
]