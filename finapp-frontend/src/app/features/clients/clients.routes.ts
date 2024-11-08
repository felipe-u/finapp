import { Routes } from "@angular/router";
import { ClientComponent } from "./client/client.component";
import { FinancingComponent } from "./client/financing/financing.component";
import { PersonalInfoComponent } from "./client/personal-info/personal-info.component";
import { GeoInfoComponent } from "./client/geo-info/geo-info.component";
import { CommercialInfoComponent } from "./client/commercial-info/commercial-info.component";

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