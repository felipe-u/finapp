import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LocationService', () => {
    let service: LocationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LocationService]
        });

        service = TestBed.inject(LocationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch departments and cities from local JSON', () => {
        const mockData = [
            { departamento: 'Antioquia', ciudades: ['Medellín', 'Envigado'] },
            { departamento: 'Cundinamarca', ciudades: ['Bogotá', 'Soacha'] }
        ];

        service.getDepartmentsAndCities().subscribe(data => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('/assets/json/colombia.json');
        expect(req.request.method).toBe('GET');

        req.flush(mockData);
    });
});
