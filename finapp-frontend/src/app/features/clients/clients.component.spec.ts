import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientsComponent } from './clients.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ClientsService } from '../../core/services/clients.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;
  let mockClientsService: jasmine.SpyObj<ClientsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockClientsService = jasmine.createSpyObj('ClientsService', [
      'getDebtorsList',
      'getDebtorsBySearchTerm',
      'getDebtorsByStatuses'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ClientsComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: ClientsService, useValue: mockClientsService },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call validateInput if searchTerm is not empty', () => {
    const validateSpy = spyOn(component, 'validateInput');
    component.searchTerm = 'test';
    component.searchClient();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should search by name if searchTerm has only letters', () => {
    component.searchTerm = 'john';
    const mockDebtors = [{ name: 'john' }];
    mockClientsService.getDebtorsBySearchTerm.and.returnValue(of(mockDebtors));

    component.validateInput();

    expect(mockClientsService.getDebtorsBySearchTerm).toHaveBeenCalledWith('john');
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should search by ID if searchTerm has only numbers', () => {
    component.searchTerm = '12345';
    const mockDebtors = [{ identification: { number: '12345' } }];
    mockClientsService.getDebtorsBySearchTerm.and.returnValue(of(mockDebtors));

    component.validateInput();

    expect(mockClientsService.getDebtorsBySearchTerm).toHaveBeenCalledWith('12345');
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should filter debtors by selected statuses', () => {
    const mockDebtors = [{ financing: { status: 'AD' } }];
    component.filterForm.setValue({
      AD: true,
      EM: false,
      CT: false,
      CP: false,
      CJ: false
    });

    mockClientsService.getDebtorsByStatuses.and.returnValue(of(mockDebtors));

    component.filterByStatuses();

    expect(mockClientsService.getDebtorsByStatuses).toHaveBeenCalledWith(['AD']);
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should navigate to client profile', () => {
    component.openClientProfile('abc123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['clients', 'abc123']);
  });

  it('should log an error if getDebtorsBySearchTerm fails', () => {
    const error = new Error('Search error');
    component.searchTerm = 'john';
    mockClientsService.getDebtorsBySearchTerm.and.returnValue(throwError(() => error));

    const consoleSpy = spyOn(console, 'error');
    component.validateInput();

    expect(consoleSpy).toHaveBeenCalledWith('Search error');
  });
});