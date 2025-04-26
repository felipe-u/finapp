import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService } from './clients.service';
import { environment } from '../../../environments/environment';

describe('ClientsService', () => {
    let service: ClientsService;
    let httpMock: HttpTestingController;
    const SERVER_URL = environment.SERVER_URL;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClientsService]
        });
        service = TestBed.inject(ClientsService);
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch and store debtors with getDebtorsList()', () => {
        const mockDebtors = [{ name: 'Juan' }, { name: 'María' }];
        (service as any).managerId.set('123');

        service.getDebtorsList().subscribe((res) => {
            expect(res).toEqual(mockDebtors);
            expect((service as any).debtors()).toEqual(mockDebtors);
        });

        const req = httpMock.expectOne(`${SERVER_URL}/debtors-list/123`);
        expect(req.request.method).toBe('GET');
        req.flush({ debtors: mockDebtors });
    });

    it('should fetch debtors by search term', () => {
        const mockDebtors = [{ name: 'Pedro' }];
        (service as any).managerId.set('123');

        service.getDebtorsBySearchTerm('Pedro').subscribe((res) => {
            expect(res).toEqual(mockDebtors);
        });

        const req = httpMock.expectOne(
            r => r.url === `${SERVER_URL}/debtors-list/123` && r.params.get('searchTerm') === 'Pedro'
        );
        expect(req.request.method).toBe('GET');
        req.flush({ debtors: mockDebtors });
    });

    it('should return the client signal', () => {
        const mockClient = { name: 'Juan', id: '123' };
        (service as any).client.set(mockClient);

        const client = service.getClient();
        expect(client()).toEqual(mockClient);
    });

    it('should fetch a client by ID with findById()', () => {
        const mockClient = { name: 'Juan', id: '123' };

        service.findById('123').subscribe((client) => {
            expect(client).toEqual(mockClient);
        });

        const req = httpMock.expectOne(`${SERVER_URL}/clients/123`);
        expect(req.request.method).toBe('GET');
        req.flush({ client: mockClient });
    });

    it('should fetch client financing with getClientFinancing()', () => {
        const mockFinancing = { amount: 1000, type: 'loan' };
        (service as any).client.set({ _id: '123' });

        service.getClientFinancing().subscribe((financing) => {
            expect(financing).toEqual(mockFinancing);
        });

        const req = httpMock.expectOne(`${SERVER_URL}/clients/123/financing`);
        expect(req.request.method).toBe('GET');
        req.flush({ financing: mockFinancing });
    });

    it('should fetch debtors by statuses with getDebtorsByStatuses()', () => {
        const mockDebtors = [{ name: 'Juan' }];
        (service as any).managerId.set('123');

        service.getDebtorsByStatuses(['active', 'inactive']).subscribe((res) => {
            expect(res).toEqual(mockDebtors);
        });

        const req = httpMock.expectOne(
            r => r.url === `${SERVER_URL}/debtors-list/123` && r.params.get('filter') === 'active,inactive'
        );
        expect(req.request.method).toBe('GET');
        req.flush({ debtors: mockDebtors });
    });
});
