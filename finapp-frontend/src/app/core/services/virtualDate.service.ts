import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VirtualDateService {
    private httpClient = inject(HttpClient);
    private apiURL = 'http://localhost:3000/virtual-date/';

    setDate() {
        return this.httpClient.post(this.apiURL + 'set', {})
    }

    getCurrentDate() {
        return this.httpClient.get<any>(this.apiURL + 'get').pipe(
            map((resData) => resData.date),
        )
    }

    advanceDate(days: number, createClients: boolean) {
        return this.httpClient.post(this.apiURL + 'advance', { days, createClients })
    }

    resetDate() {
        return this.httpClient.post(this.apiURL + 'reset', {})
    }

}