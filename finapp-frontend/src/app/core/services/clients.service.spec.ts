import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
    let service: ClientsService;
    let httpMock: HttpTestingController;

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

        const req = httpMock.expectOne('http://localhost:3000/debtors-list/123');
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
            r => r.url === 'http://localhost:3000/debtors-list/123' && r.params.get('searchTerm') === 'Pedro'
        );
        expect(req.request.method).toBe('GET');
        req.flush({ debtors: mockDebtors });
    });
});
