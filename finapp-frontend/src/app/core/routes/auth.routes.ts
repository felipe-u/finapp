import { Routes } from "@angular/router";
import { RegisterComponent } from "../../shared/auth/register/register.component";
import { LoginComponent } from "../../shared/auth/login/login.component";
import { ROUTE_PATHS, ROUTE_TITLES } from "../utils/auth.routes.constants";

export const routes: Routes = [
    {
        path: ROUTE_PATHS.REGISTER,
        component: RegisterComponent,
        title: ROUTE_TITLES.REGISTER
    },
    {
        path: ROUTE_PATHS.LOGIN,
        component: LoginComponent,
        title: ROUTE_TITLES.LOGIN
    }
]