import { HttpClient, HttpParams } from '@angular/common/http';
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
    private managerId = signal<string | undefined>(undefined);
    url = 'http://localhost:3000/';

    getDebtorsList() {
        return this.fetchDebtors().pipe(
            tap({
                next: (debtors) => this.debtors.set(debtors)
            })
        )
    }

    getDebtorsBySearchTerm(searchTerm: string) {
        const params = new HttpParams().set('searchTerm', searchTerm);
        return this.fetchDebtors(params);
    }

    getDebtorsByStatuses(statuses: string[]) {
        const params = new HttpParams().set('filter', statuses.join(','));
        return this.fetchDebtors(params);
    }

    findById(clientId: string) {
        return this.httpClient.get<any>(this.url + 'clients/' + clientId).pipe(
            tap({
                next: (client) => this.client.set(client)
            }),
            map((resData) => resData.client),
        );
    }

    getClient() {
        return this.client;
    }

    setClient(client: any) {
        this.client.set(client);
    }

    getDebtorId() {
        return this.debtorId;
    }

    setDebtorId(debtorId: string) {
        this.debtorId.set(debtorId);
    }

    getCodebtorId() {
        return this.codebtorId;
    }

    setCodebtorId(codebtorId: string) {
        this.codebtorId.set(codebtorId);
    }

    getManagerId() {
        return this.managerId;
    }

    setManagerId(managerId: string) {
        this.managerId.set(managerId);
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

    assignDebtorToManager(debtorId: string) {
        return this.httpClient.post(this.url + 'assign-debtor', {
            clientId: debtorId,
            managerId: this.managerId()
        })
    }

    removeDebtorFromManager(debtorId: string) {
        return this.httpClient.post(
            this.url + 'remove-debtor/', { clientId: debtorId }
        );
    }

    getAllDebtorsBySearchTerm(searchTerm: string) {
        const params = new HttpParams().set('searchTerm', searchTerm);
        return this.httpClient.get<any>(this.url + 'all-debtors', { params }).pipe(
            map((resData) => resData.debtors)
        )
    }

    getDebtorsWithoutAssignment() {
        return this.httpClient.get<any>(this.url + 'debtors-list-no-assignment').pipe(
            map((resData) => resData.debtors)
        );
    }

    getDebtorsForReport(reportType: string, days: string) {
        const params = new HttpParams().set('reportType', reportType).append('days', days);
        return this.httpClient.get<any>(this.url + 'debtors-list-report', { params })
    }

    private fetchDebtors(params?: HttpParams) {
        const _url = this.url + 'debtors-list/' + this.managerId();
        return this.httpClient.get<any>(_url, { params }).pipe(
            map((resData) => resData.debtors)
        );
    }

}