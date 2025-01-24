import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { PersonalInfo } from '../models/personalInfo.model';
import { GeoInfo } from '../models/geoInfo.model';
import { CommercialInfo } from '../models/commercialInfo.model';
import { Reference } from '../models/reference.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private httpClient = inject(HttpClient);
    private clients = signal<any>([]);
    private client = signal<any | undefined>(undefined);
    private debtors = signal<any>([]);
    private codebtorId = signal<string | undefined>(undefined);
    private debtorId = signal<string | undefined>(undefined);
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

    setDebtorId(debtorId: string) {
        this.debtorId.set(debtorId);
    }

    getDebtorId() {
        return this.debtorId;
    }

    setCodebtorId(codebtorId: string) {
        this.codebtorId.set(codebtorId);
    }

    getCodebtorId() {
        return this.codebtorId;
    }

    getClientFinancing() {
        console.log("Recuperando financiamiento del cliente: ", this.client()._id);
        return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/financing')
            .pipe(
                map((resData) => resData.financing)
            );

    }

    getClientPersonalInfo() {
        console.log("Recuperando información personal del cliente: ", this.client()._id);
        return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/personalInfo')
            .pipe(
                map((resData) => resData.personalInfo)
            );
    }

    editPersonalInfo(updatedPersonalInfo: PersonalInfo, updatedIdNumber: string) {
        console.log("Editando información del cliente: ", this.client()._id);
        return this.httpClient.post(
            this.url + 'clients/' + this.client()._id + '/personalInfo/edit',
            { newIdNumber: updatedIdNumber, newPersonalInfo: updatedPersonalInfo }
        )

    }

    getClientGeographicInfo() {
        console.log("Recuperando información geográfica del cliente: ", this.client()._id);
        return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/geoInfo')
            .pipe(
                map((resData) => resData.geoInfo)
            );
    }


    editGeoInfo(updatedGeoInfo: GeoInfo) {
        console.log("Editando información geográfica del cliente: ", this.client()._id);
        return this.httpClient.post(
            this.url + 'clients/' + this.client()._id + '/geoInfo/edit', updatedGeoInfo
        )
    }

    getClientCommercialInfo() {
        console.log("Recuperando información comercial del cliente: ", this.client()._id);
        return this.httpClient.get<any>(this.url + 'clients/' + this.client()._id + '/commercialInfo')
    }

    editCommercialInfo(updatedCommercialInfo: CommercialInfo, updatedReferences: Reference[]) {
        console.log("Editando información comercial del cliente: ", this.client()._id);
        return this.httpClient.post(
            this.url + 'clients/' + this.client()._id + '/commercialInfo/edit',
            { newCommercialInfo: updatedCommercialInfo, newReferences: updatedReferences }
        )
    }

    getDebtorName() {
        return this.getClientName(this.debtorId());
    }

    getCodebtorName() {
        return this.getClientName(this.codebtorId());
    }

    getClientName(clientId: string) {
        return this.httpClient.get<any>(this.url + 'clients/' + clientId + '/name')
            .pipe(
                map((resData) => resData.name)
            );
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