import { TestBed } from '@angular/core/testing';
import { NotiflixService } from './notiflix.service';
import { TranslateService } from '@ngx-translate/core';
import Notiflix from 'notiflix';

// Simulación de `TranslateService` para las pruebas
class MockTranslateService {
    instant(key: string): string {
        return key; // Devolver la clave misma como la traducción
    }
}

describe('NotiflixService', () => {
    let service: NotiflixService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NotiflixService,
                { provide: TranslateService, useClass: MockTranslateService }
            ]
        });
        service = TestBed.inject(NotiflixService);

        spyOn(Notiflix.Confirm, 'show').and.callFake(() => { });
        spyOn(Notiflix.Notify, 'success').and.callFake(() => { });
        spyOn(Notiflix.Notify, 'failure').and.callFake(() => { });
        spyOn(Notiflix.Notify, 'info').and.callFake(() => { });
        spyOn(Notiflix.Loading, 'standard').and.callFake(() => { });
        spyOn(Notiflix.Loading, 'remove').and.callFake(() => { });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show confirm message', () => {
        const onConfirm = jasmine.createSpy('onConfirm');
        const onCancel = jasmine.createSpy('onCancel');

        service.showConfirm('Confirm Title', 'Are you sure?', onConfirm, onCancel);
        expect(Notiflix.Confirm.show).toHaveBeenCalledWith(
            'Confirm Title', 'Are you sure?', 'FIELDS.YES', 'No', onConfirm, onCancel
        );
    });

    it('should show success notification', () => {
        const message = 'Success!';
        service.showSuccess(message);
        expect(Notiflix.Notify.success).toHaveBeenCalledWith(message);
    });

    it('should show error notification', () => {
        const message = 'Error!';
        service.showError(message);
        expect(Notiflix.Notify.failure).toHaveBeenCalledWith(message);
    });

    it('should show info notification', () => {
        const message = 'Info!';
        service.showInfo(message);
        expect(Notiflix.Notify.info).toHaveBeenCalledWith(message);
    });

    it('should show loading', () => {
        service.showLoading();
        expect(Notiflix.Loading.standard).toHaveBeenCalled();
    });

    it('should hide loading', () => {
        service.hideLoading();
        expect(Notiflix.Loading.remove).toHaveBeenCalled();
    });
});
