import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private httpClient = inject(HttpClient);
    private clients = signal<any>([]);
    private client = signal<any | undefined>(undefined);
    private debtors = signal<any>([]);
    url = 'http://localhost:3000/';

    getAllDebtorsList() {
        return this.fetchDebtors(this.url + 'debtors-list').pipe(
            tap({
                next: (debtors) => this.debtors.set(debtors)
            })
        )
    }

    findById(clientId: string) {
        return this.httpClient.get<any>(this.url + 'clients/' + clientId).pipe(
            tap({
                next: (client) => this.client.set(client)
            }),
            map((resData) => resData.client),
        );
    }

    setClient(client: any) {
        this.client.set(client);
    }

    getClient() {
        return this.client;
    }

    getClientFinancing() {
        console.log("Recuperando financiamiento del cliente: ", this.client()._id);
        return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/financing')
            .pipe(
                map((resData) => resData.financing));

    }

    getClientPersonalInfo() {
        console.log("Recuperando información personal del cliente: ", this.client()._id);
        // return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/personal-info');
    }

    getClientGeographicInfo() {
        console.log("Recuperando información geográfica del cliente: ", this.client()._id);
        // return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/geographic-info');
    }

    getClientCommercialInfo() {
        console.log("Recuperando información comercial del cliente: ", this.client()._id);
        // return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/commercial-info');
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