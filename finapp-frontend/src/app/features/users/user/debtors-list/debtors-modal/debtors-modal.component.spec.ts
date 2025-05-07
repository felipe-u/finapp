import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsModalComponent } from './debtors-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ClientsService } from '../../../../../core/services/clients.service';
import { NotiflixService } from '../../../../../core/services/notiflix.service';
import { of } from 'rxjs';
import { LogMessages } from '../../../../../core/utils/log-messages';

describe('DebtorsModalComponent', () => {
  let component: DebtorsModalComponent;
  let fixture: ComponentFixture<DebtorsModalComponent>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;
  let notiflixSpy: jasmine.SpyObj<NotiflixService>

  beforeEach(async () => {
    const clientsServiceMock = jasmine.createSpyObj('ClientsService', [
      'getDebtorsWithoutAssignment',
      'getAllDebtorsBySearchTerm',
      'assignDebtorToManager'
    ]);

    const notiflixMock = jasmine.createSpyObj('NotiflixService', ['showConfirm', 'showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      imports: [
        DebtorsModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientsServiceMock },
        { provide: NotiflixService, useValue: notiflixMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DebtorsModalComponent);
    component = fixture.componentInstance;
    clientsServiceSpy = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;
    notiflixSpy = TestBed.inject(NotiflixService) as jasmine.SpyObj<NotiflixService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onCancel is called', () => {
    spyOn(component.close, 'emit');
    component.onCancel();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should show search bar when showSearchBar() is called', () => {
    component.showSearchBar();
    expect(component.showingSearchBar).toBeTrue();
  });

  it('should reset view states and searchTerm when goToMenu is called', () => {
    component.showingSearchBar = true;
    component.showingDebtorsWithoutAssignment = true;
    component.showingDebtorsFound = true;
    component.searchTerm = 'test';

    component.goToMenu();

    expect(component.showingSearchBar).toBeFalse();
    expect(component.showingDebtorsWithoutAssignment).toBeFalse();
    expect(component.showingDebtorsFound).toBeFalse();
    expect(component.searchTerm).toBe('');
  });

  it('should show debtors without assignment when showDebtorsWithoutAssignent() is called', () => {
    clientsServiceSpy.getDebtorsWithoutAssignment.and.returnValue(of([]));
    component.showDebtorsWithoutAssignent();
    expect(component.showingDebtorsWithoutAssignment).toBeTrue();
    expect(clientsServiceSpy.getDebtorsWithoutAssignment).toHaveBeenCalled();
  });

  it('should emit updateDebtors after assigning debtor', () => {
    const debtorId = '123';
    const fakeDebtors = [{ _id: '1', name: 'Juan' }];
    clientsServiceSpy.assignDebtorToManager.and.returnValue(of({}));
    clientsServiceSpy.getDebtorsWithoutAssignment.and.returnValue(of(fakeDebtors));
    clientsServiceSpy.getAllDebtorsBySearchTerm.and.returnValue(of(fakeDebtors));

    spyOn(component.updateDebtors, 'emit');
    notiflixSpy.showConfirm.and.callFake((title, message, okCallback) => {
      okCallback();
    });

    component.onAddToManager(debtorId, 'ass');
    expect(clientsServiceSpy.assignDebtorToManager).toHaveBeenCalledWith(debtorId);
    expect(component.updateDebtors.emit).toHaveBeenCalled();
    expect(notiflixSpy.showSuccess).toHaveBeenCalled();
  });

  it('should search by name when input has letters', () => {
    component.searchTerm = 'John';
    clientsServiceSpy.getAllDebtorsBySearchTerm.and.returnValue(of([]));
    component.searchClient();
    expect(clientsServiceSpy.getAllDebtorsBySearchTerm).toHaveBeenCalledWith('John');
  });

  it('should log appropriate message when validateInput is called with letters and numbers', () => {
    component.searchTerm = 'John123';
    spyOn(component['loggingService'], 'log');

    component['validateInput']();

    expect(component['loggingService'].log).toHaveBeenCalledWith(LogMessages.NUMBERS_AND_LETTERS);
  });

  it('should log appropriate message and update debtors found when validateInput is called with letters only', () => {
    component.searchTerm = 'John';
    spyOn(component['loggingService'], 'log');
    spyOn<any>(component, 'updateDebtorsFound');

    component['validateInput']();

    expect(component['loggingService'].log).toHaveBeenCalledWith(LogMessages.SEARCHING('name'));
    expect(component['updateDebtorsFound']).toHaveBeenCalled();
  });

  it('should log appropriate message when validateInput is called with no letters or numbers', () => {
    component.searchTerm = '!!!';
    spyOn(component['loggingService'], 'log');

    component['validateInput']();

    expect(component['loggingService'].log).toHaveBeenCalledWith(LogMessages.NO_NUMBERS_NOR_LETTERS);
  });

  it('should update debtorsFound and set showingDebtorsFound to true when updateDebtorsFound is called with results', () => {
    const fakeDebtors = [{ _id: '1', name: 'Juan' }];
    clientsServiceSpy.getAllDebtorsBySearchTerm.and.returnValue(of(fakeDebtors));

    component['updateDebtorsFound']();

    expect(clientsServiceSpy.getAllDebtorsBySearchTerm).toHaveBeenCalledWith(component.searchTerm);
    expect(component.showingDebtorsFound).toBeTrue();
    expect(component.debtorsFound()).toEqual(fakeDebtors);
  });

  it('should update debtorsWithoutAssignment when updateDebtorsWithoutAssignment is called', () => {
    const fakeDebtors = [{ _id: '1', name: 'Juan' }];
    clientsServiceSpy.getDebtorsWithoutAssignment.and.returnValue(of(fakeDebtors));

    component['updateDebtorsWithoutAssignment']();

    expect(clientsServiceSpy.getDebtorsWithoutAssignment).toHaveBeenCalled();
    expect(component.debtorsWithoutAssignment()).toEqual(fakeDebtors);
  });
});
