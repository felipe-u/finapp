import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private httpClient = inject(HttpClient);
    private clients = signal<any>([]);
    private debtors = signal<any>([]);
    url = 'http://localhost:3000/';

    getAllDebtorsList() {
        return this.fetchDebtors(this.url + 'debtors-list').pipe(
            tap({
                next: (debtors) => this.debtors.set(debtors)
            })
        )
    }

    getDebtorsBySearchTerm(searchTerm: string) {
        return this.fetchDebtors(this.url + 'debtors-list/' + searchTerm);
    }

    getDebtorsByStatuses(statuses: string[]) {
        return this.fetchDebtors(this.url + 'debtors-list/statuses/' + statuses.join(','));
    }

    private fetchDebtors(url: string) {
        return this.httpClient.get<any>(url).pipe(
            map((resData) => resData.debtors)
        )
    }

}