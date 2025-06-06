import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { PersonalInfo } from '../models/personalInfo.model';
import { GeoInfo } from '../models/geoInfo.model';
import { CommercialInfo } from '../models/commercialInfo.model';
import { Reference } from '../models/reference.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private httpClient = inject(HttpClient);
    private clients = signal<any>([]);
    private client = signal<any | undefined>(undefined);
    private debtors = signal<any>([]);
    private codebtorId = signal<string | undefined>(undefined);
    private debtorId = signal<string | undefined>(undefined);
    private managerId = signal<string | undefined>(undefined);
    private SERVER_URL = environment.SERVER_URL;

    constructor() {
        const storedManagerId = localStorage.getItem('managerId');
        if (storedManagerId) this.managerId.set(storedManagerId);
    }

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
        return this.httpClient.get<any>(this.SERVER_URL + '/clients/' + clientId).pipe(
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
        localStorage.setItem('managerId', managerId);
    }

    cleanStorage() {
        this.managerId.set(null);
        localStorage.removeItem('managerId');
    }

    getClientFinancing() {
        return this.httpClient.get<any>(
            this.SERVER_URL + '/clients/' + this.client()._id + '/financing'
        ).pipe(
            map((resData) => resData.financing)
        );

    }

    getClientPersonalInfo() {
        return this.httpClient.get<any>(
            this.SERVER_URL + '/clients/' + this.client()._id + '/personalInfo'
        ).pipe(
            map((resData) => resData.personalInfo)
        );
    }

    editPersonalInfo(updatedPersonalInfo: PersonalInfo, updatedIdNumber: string) {
        return this.httpClient.post(
            this.SERVER_URL + '/clients/' + this.client()._id + '/personalInfo/edit',
            { newIdNumber: updatedIdNumber, newPersonalInfo: updatedPersonalInfo }
        );
    }

    getClientGeographicInfo() {
        return this.httpClient.get<any>(
            this.SERVER_URL + '/clients/' + this.client()._id + '/geoInfo'
        ).pipe(
            map((resData) => resData.geoInfo)
        );
    }


    editGeoInfo(updatedGeoInfo: GeoInfo) {
        return this.httpClient.post(
            this.SERVER_URL + '/clients/' + this.client()._id + '/geoInfo/edit', { updatedGeoInfo }
        );
    }

    getClientCommercialInfo() {
        return this.httpClient.get<any>(
            this.SERVER_URL + '/clients/' + this.client()._id + '/commercialInfo'
        );
    }

    editCommercialInfo(updatedCommercialInfo: CommercialInfo, updatedReferences: Reference[]) {
        return this.httpClient.post(
            this.SERVER_URL + '/clients/' + this.client()._id + '/commercialInfo/edit',
            { newCommercialInfo: updatedCommercialInfo, newReferences: updatedReferences }
        );
    }

    getDebtorName() {
        return this.getClientName(this.debtorId());
    }

    getCodebtorName() {
        return this.getClientName(this.codebtorId());
    }

    getClientName(clientId: string) {
        return this.httpClient.get<any>(this.SERVER_URL + '/clients/' + clientId + '/name')
            .pipe(
                map((resData) => resData.name)
            );
    }

    assignDebtorToManager(debtorId: string) {
        return this.httpClient.post(this.SERVER_URL + '/assign-debtor', {
            clientId: debtorId,
            managerId: this.managerId()
        });
    }

    removeDebtorFromManager(debtorId: string) {
        return this.httpClient.post(
            this.SERVER_URL + '/remove-debtor/', { clientId: debtorId }
        );
    }

    getAllDebtorsBySearchTerm(searchTerm: string) {
        const params = new HttpParams().set('searchTerm', searchTerm);
        return this.httpClient.get<any>(this.SERVER_URL + '/all-debtors', { params }).pipe(
            map((resData) => resData.debtors)
        );
    }

    getDebtorsWithoutAssignment() {
        return this.httpClient.get<any>(this.SERVER_URL + '/debtors-list-no-assignment').pipe(
            map((resData) => resData.debtors)
        );
    }

    getDebtorsForReport(reportType: string, days: string) {
        const params = new HttpParams()
            .set('reportType', reportType).append('days', days);
        return this.httpClient.get<any>(
            this.SERVER_URL + '/debtors-list-report', { params }
        );
    }

    private fetchDebtors(params?: HttpParams) {
        const _url = this.SERVER_URL + '/debtors-list/' + this.managerId();
        return this.httpClient.get<any>(_url, { params }).pipe(
            map((resData) => resData.debtors)
        );
    }

}