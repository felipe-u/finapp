import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsModalComponent } from './debtors-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ClientsService } from '../../../../../core/services/clients.service';
import { NotiflixService } from '../../../../../core/services/notiflix.service';
import { of } from 'rxjs';

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

  it('should show search bar when showSearchBar() is called', () => {
    component.showSearchBar();
    expect(component.showingSearchBar).toBeTrue();
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
});
