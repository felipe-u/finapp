import { Routes } from "@angular/router";
import { FinancingComponent } from "../../features/clients/client/financing/financing.component";
import { PersonalInfoComponent } from "../../features/clients/client/personal-info/personal-info.component";
import { GeoInfoComponent } from "../../features/clients/client/geo-info/geo-info.component";
import { CommercialInfoComponent } from "../../features/clients/client/commercial-info/commercial-info.component";
import { ROUTE_PATHS } from "../utils/clients.routes.constants";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'financing',
        pathMatch: 'full'
    },
    {
        path: ROUTE_PATHS.FINANCING,
        component: FinancingComponent,
    },
    {
        path: ROUTE_PATHS.PER_INFO,
        component: PersonalInfoComponent
    },
    {
        path: ROUTE_PATHS.GEO_INFO,
        component: GeoInfoComponent
    },
    {
        path: ROUTE_PATHS.COM_INFO,
        component: CommercialInfoComponent
    }
]