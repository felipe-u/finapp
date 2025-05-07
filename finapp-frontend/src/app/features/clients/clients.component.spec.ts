import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientsComponent } from './clients.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ClientsService } from '../../core/services/clients.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LogMessages } from '../../core/utils/log-messages';

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

  it('should initialize debtors list on ngOnInit', () => {
    const mockDebtors = [{ name: 'John Doe' }];
    mockClientsService.getDebtorsList.and.returnValue(of(mockDebtors));

    component.ngOnInit();

    expect(mockClientsService.getDebtorsList).toHaveBeenCalled();
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should log error if getDebtorsList fails on ngOnInit', () => {
    const error = new Error('Failed to fetch debtors');
    const loggingSpy = spyOn(component['loggingService'], 'error');
    mockClientsService.getDebtorsList.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(loggingSpy).toHaveBeenCalledWith('Failed to fetch debtors');
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

  it('should log error if getDebtorsByStatuses fails', () => {
    const error = new Error('Failed to fetch debtors by statuses');
    const loggingSpy = spyOn(component['loggingService'], 'error');
    mockClientsService.getDebtorsByStatuses.and.returnValue(throwError(() => error));

    component.filterByStatuses();

    expect(loggingSpy).toHaveBeenCalledWith('Failed to fetch debtors by statuses');
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

  it('should log appropriate message when searchTerm contains only letters', () => {
    const loggingSpy = spyOn(component['loggingService'], 'log');
    const mockDebtors = [{ name: 'John' }];
    component.searchTerm = 'John';
    mockClientsService.getDebtorsBySearchTerm.and.returnValue(of(mockDebtors));

    component.validateInput();

    expect(loggingSpy).toHaveBeenCalledWith(LogMessages.SEARCHING('name'));
    expect(mockClientsService.getDebtorsBySearchTerm).toHaveBeenCalledWith('John');
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

  it('should log appropriate message when searchTerm contains only numbers', () => {
    const loggingSpy = spyOn(component['loggingService'], 'log');
    const mockDebtors = [{ identification: { number: '12345' } }];
    component.searchTerm = '12345';
    mockClientsService.getDebtorsBySearchTerm.and.returnValue(of(mockDebtors));

    component.validateInput();

    expect(loggingSpy).toHaveBeenCalledWith(LogMessages.SEARCHING('identification'));
    expect(mockClientsService.getDebtorsBySearchTerm).toHaveBeenCalledWith('12345');
    expect(component.debtors()).toEqual(mockDebtors);
  });

  it('should log appropriate message when searchTerm contains both letters and numbers', () => {
    const loggingSpy = spyOn(component['loggingService'], 'log');
    component.searchTerm = 'abc123';

    component.validateInput();

    expect(loggingSpy).toHaveBeenCalledWith(LogMessages.NUMBERS_AND_LETTERS);
  });

  it('should log appropriate message when searchTerm is empty', () => {
    const loggingSpy = spyOn(component['loggingService'], 'log');
    component.searchTerm = '';

    component.validateInput();

    expect(loggingSpy).toHaveBeenCalledWith(LogMessages.NO_NUMBERS_NOR_LETTERS);
  });

  it('should navigate to client profile', () => {
    component.openClientProfile('abc123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['clients', 'abc123']);
  });
});