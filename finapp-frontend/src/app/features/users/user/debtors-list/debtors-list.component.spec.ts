import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DebtorsListComponent } from './debtors-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { NotiflixService } from '../../../../core/services/notiflix.service';
import { of, throwError } from 'rxjs';

describe('DebtorsListComponent', () => {
  let component: DebtorsListComponent;
  let fixture: ComponentFixture<DebtorsListComponent>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;
  let notiflixSpy: jasmine.SpyObj<NotiflixService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    const clientsSpy = jasmine.createSpyObj('ClientsService', ['getDebtorsList', 'removeDebtorFromManager', 'setManagerId']);
    const notiflixMock = jasmine.createSpyObj('NotiflixService', ['showConfirm', 'showSuccess', 'showError']);


    await TestBed.configureTestingModule({
      imports: [
        DebtorsListComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        { provide: ClientsService, useValue: clientsSpy },
        { provide: NotiflixService, useValue: notiflixMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DebtorsListComponent);
    component = fixture.componentInstance;
    clientsServiceSpy = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;
    notiflixSpy = TestBed.inject(NotiflixService) as jasmine.SpyObj<NotiflixService>;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle managingDebtors to true on manageDebtors()', () => {
    component.manageDebtors();
    expect(component.managingDebtors).toBeTrue();
  });

  it('should toggle managingDebtors to false on cancelManage()', () => {
    component.managingDebtors = true;
    component.cancelManage();
    expect(component.managingDebtors).toBeFalse();
  });

  it('should open modal on openDebtorsModal()', () => {
    component.openDebtorsModal();
    expect(component.isModalOpen).toBeTrue();
  });

  it('should close modal and call updateDebtorsList on closeDebtorsModal()', () => {
    spyOn(component, 'updateDebtorsList');
    component.closeDebtorsModal();
    expect(component.isModalOpen).toBeFalse();
    expect(component.updateDebtorsList).toHaveBeenCalled();
  });

  it('should update debtors list on success', () => {
    const mockDebtors = [{ _id: '1', name: 'Test Debtor' }];
    clientsServiceSpy.getDebtorsList.and.returnValue(of(mockDebtors));

    component.updateDebtorsList();

    expect(clientsServiceSpy.getDebtorsList).toHaveBeenCalled();
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should remove debtor after confirm', fakeAsync(() => {
    const debtorId = '123';
    clientsServiceSpy.removeDebtorFromManager.and.returnValue(of({}));
    spyOn(component, 'updateDebtorsList');
    spyOn(translateService, 'instant').and.callFake((key) => key);

    notiflixSpy.showConfirm.and.callFake((title, message, onOk) => {
      onOk();
    });

    component.onRemoveDebtor(debtorId);
    tick();

    expect(clientsServiceSpy.removeDebtorFromManager).toHaveBeenCalledWith(debtorId);
    expect(component.updateDebtorsList).toHaveBeenCalled();
    expect(notiflixSpy.showSuccess).toHaveBeenCalled();
  }));

  it('should show error if removeDebtorFromManager fails', fakeAsync(() => {
    const debtorId = '123';
    clientsServiceSpy.removeDebtorFromManager.and.returnValue(throwError(() => new Error('fail')));
    spyOn(translateService, 'instant').and.callFake((key) => key);

    notiflixSpy.showConfirm.and.callFake((title, message, onOk) => {
      onOk();
    });

    component.onRemoveDebtor(debtorId);
    tick();

    expect(clientsServiceSpy.removeDebtorFromManager).toHaveBeenCalledWith(debtorId);
    expect(notiflixSpy.showError).toHaveBeenCalled();
  }));
});
