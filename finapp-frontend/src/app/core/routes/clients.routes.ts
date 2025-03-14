import { Routes } from "@angular/router";
import { FinancingComponent } from "../../features/clients/client/financing/financing.component";
import { PersonalInfoComponent } from "../../features/clients/client/personal-info/personal-info.component";
import { GeoInfoComponent } from "../../features/clients/client/geo-info/geo-info.component";
import { CommercialInfoComponent } from "../../features/clients/client/commercial-info/commercial-info.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'financing',
        pathMatch: 'full'
    },
    {
        path: 'financing',
        component: FinancingComponent,
    },
    {
        path: 'personal-info',
        component: PersonalInfoComponent
    },
    {
        path: 'geo-info',
        component: GeoInfoComponent
    },
    {
        path: 'commercial-info',
        component: CommercialInfoComponent
    }
]