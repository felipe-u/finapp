import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LocationService {
    private httpClient = inject(HttpClient);

    getDepartmentsAndCities() {
        return this.httpClient.get('/assets/json/colombia.json');
    }
}