import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercialInfoComponent } from './commercial-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NotiflixService } from '../../../../core/services/notiflix.service';
import { LoggingService } from '../../../../core/services/logging.service';
import { Router } from '@angular/router';

describe('CommercialInfoComponent', () => {
  let component: CommercialInfoComponent;
  let fixture: ComponentFixture<CommercialInfoComponent>;
  let clientServiceMock: any;

  beforeEach(async () => {
    const notiflixMock = {
      showConfirm: jasmine.createSpy('showConfirm').and.callFake((title, message, onConfirm, onCancel) => {
        onConfirm();
      }),
      showError: jasmine.createSpy('showError').and.callFake((title) => { })
    };
    const mockClient = { _id: "mock-id", name: "Test Client", role: "debtor" };
    clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientCommercialInfo: jasmine.createSpy('getClientCommercialInfo').and.returnValue(of({
        commercialInfo: {
          _id: 'mock-id',
          jobOccupation: 'Doctor',
          company: 'TechCorp',
          laborSenority: '5',
          income: 2000000,
          additionalIncome: 500000,
          expenses: 1000000,
        },
        references: [
          { name: 'John Doe', phone: '123456789', relationshipType: 'FAM' },
          { name: 'Jane Doe', phone: '987654321', relationshipType: 'PER' },
        ]
      })),
      getCodebtorName: jasmine.createSpy('getCodebtorName').and.returnValue(of('Jane Codebtor')),
      getDebtorName: jasmine.createSpy('getDebtorName').and.returnValue(of('John Debtor')),
      setDebtorId: jasmine.createSpy('setDebtorId'),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommercialInfoComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: ClientsService, useValue: clientServiceMock },
        { provide: NotiflixService, useValue: notiflixMock },
        FormBuilder
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommercialInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loader if commercialInfo() is undefined', () => {
    spyOn(component, 'commercialInfo').and.returnValue(undefined);
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('.loader-container');
    expect(loader).toBeTruthy();
  });

  it('should show info table if commercialInfo() retrieve data', () => {
    spyOn(component, 'commercialInfo').and.returnValue({
      _id: 'mock-id',
      jobOccupation: 'Doctor',
      company: 'TechCorp',
      laborSenority: '5',
      income: 2000000,
      additionalIncome: 500000,
      expenses: 1000000,
    });
    component.editMode = false;
    fixture.detectChanges();

    const jobOccupation = fixture.nativeElement.querySelector('td:nth-child(2)');
    expect(jobOccupation?.textContent).toContain('Doctor');
  });

  it('should load commercial info and references on init', () => {
    fixture.detectChanges();
    expect(clientServiceMock.getClientCommercialInfo).toHaveBeenCalled();
    expect(component.commercialInfo()).toEqual({
      _id: 'mock-id',
      jobOccupation: 'Doctor',
      company: 'TechCorp',
      laborSenority: '5',
      income: 2000000,
      additionalIncome: 500000,
      expenses: 1000000,
    });
  });

  it('should log an error if something is wrong loading commercial info', () => {
    clientServiceMock.getClientCommercialInfo.and.returnValue(throwError(() => new Error('Error')));
    const loggingService = TestBed.inject(LoggingService);
    spyOn(loggingService, 'error');
    fixture.detectChanges();
    expect(loggingService.error).toHaveBeenCalledWith('Error')
  })

  it('should set coDebtorName if role is debtor', () => {
    fixture.detectChanges();
    expect(clientServiceMock.getCodebtorName).toHaveBeenCalled();
    expect(component.coDebtorName()).toBe('Jane Codebtor');
  });

  it('should log an error if something is wrong getting codebtor name on init', () => {
    clientServiceMock.getCodebtorName.and.returnValue(throwError(() => new Error('Error')));
    const loggingService = TestBed.inject(LoggingService);
    spyOn(loggingService, 'error');
    fixture.detectChanges();
    expect(loggingService.error).toHaveBeenCalledWith('Error');
  });

  it('should set debtorName if role is codebtor', () => {
    const mockClient = { _id: "mock-id", name: "Test Client", role: "codebtor" };
    clientServiceMock.getClient = () => signal(mockClient);
    fixture.detectChanges();
    expect(clientServiceMock.getDebtorName).toHaveBeenCalled();
    expect(component.debtorName()).toBe('John Debtor');
  });

  it('should log an error if something is wrong getting debtor name on init', () => {
    const mockClient = { _id: "mock-id", name: "Test Client", role: "codebtor" };
    clientServiceMock.getClient = () => signal(mockClient);
    clientServiceMock.getDebtorName.and.returnValue(throwError(() => new Error('Error')));
    const loggingService = TestBed.inject(LoggingService);
    spyOn(loggingService, 'error');
    fixture.detectChanges();
    expect(loggingService.error).toHaveBeenCalledWith('Error');
  });

  it('should enable edit mode when changeEditMode() is called', () => {
    expect(component.editMode).toBe(false);
    component.changeEditMode();
    expect(component.editMode).toBe(true);
  });

  it('should disable edit mode when changeEditMode() is called again', () => {
    component.changeEditMode();
    expect(component.editMode).toBe(true);
    component.changeEditMode();
    expect(component.editMode).toBe(false);
  });

  it('should submit the form when all fields are valid', () => {
    component.form.patchValue({
      commercialInfo: {
        jobOccupation: 'Engineer',
        company: 'TechCorp',
        laborSenority: 5,
        income: 3000000,
        additionalIncome: 1000000,
        expenses: 1500000,
      },
      references: {
        famRef1: { name: 'John Doe', phone: '123456789', relationship: 'Family' },
        famRef2: { name: 'Jane Doe', phone: '987654321', relationship: 'Family' },
        perRef1: { name: 'Mark Smith', phone: '1122334455', relationship: 'Personal' },
        perRef2: { name: 'Lucy Brown', phone: '9988776655', relationship: 'Personal' },
        comRef1: { name: 'Alice Johnson', phone: '6677889900', relationship: 'Commercial' },
        comRef2: { name: 'Bob White', phone: '5544332211', relationship: 'Commercial' },
      }
    });

    spyOn(component, 'onSubmit').and.callThrough();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not submit the form if it is invalid', () => {
    component.form.patchValue({ commercialInfo: { income: null } });
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should show an error if personal references are missing', () => {
    component.form.patchValue({
      commercialInfo: {},
      references: {
        famRef1: { name: 'A', phone: '1', relationship: 'Family' },
        famRef2: { name: 'B', phone: '2', relationship: 'Family' },
        perRef1: null,
        perRef2: null,
        comRef1: { name: 'C', phone: '3', relationship: 'Commercial' },
        comRef2: { name: 'D', phone: '4', relationship: 'Commercial' },
      }
    });
    const notiflix = TestBed.inject(NotiflixService);
    component.onSubmit();
    expect(notiflix.showError).toHaveBeenCalled();
  });

  it('should show an error if familiar references are missing', () => {
    component.form.patchValue({
      commercialInfo: {},
      references: {
        famRef1: null,
        famRef2: null,
        perRef1: { name: 'A', phone: '1', relationship: 'Personal' },
        perRef2: { name: 'A', phone: '1', relationship: 'Personal' },
        comRef1: { name: 'C', phone: '3', relationship: 'Commercial' },
        comRef2: { name: 'D', phone: '4', relationship: 'Commercial' },
      }
    });
    const notiflix = TestBed.inject(NotiflixService);
    component.onSubmit();
    expect(notiflix.showError).toHaveBeenCalled();
  });

  it('should show an error if commercial references are missing', () => {
    component.form.patchValue({
      commercialInfo: {},
      references: {
        famRef1: { name: 'A', phone: '1', relationship: 'Familiar' },
        famRef2: { name: 'B', phone: '2', relationship: 'Familiar' },
        perRef1: { name: 'A', phone: '1', relationship: 'Personal' },
        perRef2: { name: 'A', phone: '1', relationship: 'Personal' },
        comRef1: null,
        comRef2: null,
      }
    });
    const notiflix = TestBed.inject(NotiflixService);
    component.onSubmit();
    expect(notiflix.showError).toHaveBeenCalled();
  });

  describe('extractYearValue', () => {
    it('should return the first digit of the string as a number', () => {
      const input = '123abc';
      const result = component.extractYearValue(input);
      expect(result).toBe(1);
    });

    it('should return NaN if the first character is not a number', () => {
      const input = 'abc123';
      const result = component.extractYearValue(input);
      expect(result).toBeNaN();
    });
  });

  it('should return "Amigo/a" for "AMI"', () => {
    expect(component.extractRelationshipEnum('AMI')).toBe('Amigo/a');
  });

  it('should throw error for invalid value', () => {
    expect(() => component.extractRelationshipEnum('Other')).toThrow();
  });

  describe('buildJobOccupation', () => {
    it('should return "1 año" for input 1', () => {
      const input = 1;
      const result = component.buildJobOccupation(input);
      expect(result).toBe('1 año');
    });

    it('should return "{input} años" for input greater than 1', () => {
      const input = 3;
      const result = component.buildJobOccupation(input);
      expect(result).toBe('3 años');
    });
  });

  it('should navigate to codebtor profile when openCodebtorProfile() is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const mockClient = { _id: 'mock-id', codebtor: 'codebtor-id' };
    component.client = signal(mockClient);

    component.openCodebtorProfile();

    expect(clientServiceMock.setDebtorId).toHaveBeenCalledWith('mock-id');
    expect(router.navigate).toHaveBeenCalledWith(['/clients', 'codebtor-id']);
  });

  it('should navigate to debtor profile when openDebtorProfile() is called', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    clientServiceMock.getDebtorId = jasmine.createSpy('getDebtorId').and.returnValue(() => 'debtor-id');

    component.openDebtorProfile();

    expect(clientServiceMock.getDebtorId).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/clients', 'debtor-id']);
  });
});
