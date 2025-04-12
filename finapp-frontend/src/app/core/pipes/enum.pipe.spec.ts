import { EnumPipe } from './enum.pipe';
import { TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

describe('EnumPipe', () => {
    let pipe: EnumPipe;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('TranslateService', ['instant']);

        TestBed.configureTestingModule({
            providers: [
                { provide: TranslateService, useValue: spy },
            ]
        });

        translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

        TestBed.runInInjectionContext(() => {
            pipe = new EnumPipe();
        });
    });

    it('should create', () => {
        expect(pipe).toBeTruthy();
    });

    it('should call translate.instant with correct key', () => {
        translateServiceSpy.instant.and.returnValue('Traducido');
        const result = pipe.transform('ADMIN', 'user.roles');
        expect(translateServiceSpy.instant).toHaveBeenCalledWith('user.roles.ADMIN');
        expect(result).toBe('Traducido');
    });
});
