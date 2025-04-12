import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercialInfoComponent } from './commercial-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NotiflixService } from '../../../../core/services/notiflix.service';

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
      getDebtorName: jasmine.createSpy('getDebtorName').and.returnValue(of('John Debtor'))
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

  it('should set coDebtorName if role is debtor', () => {
    fixture.detectChanges();
    expect(clientServiceMock.getCodebtorName).toHaveBeenCalled();
    expect(component.coDebtorName()).toBe('Jane Codebtor');
  });

  it('should set debtorName if role is codebtor', () => {
    const mockClient = { _id: "mock-id", name: "Test Client", role: "codebtor" };
    clientServiceMock.getClient = () => signal(mockClient);
    fixture.detectChanges();
    expect(clientServiceMock.getDebtorName).toHaveBeenCalled();
    expect(component.debtorName()).toBe('John Debtor');
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
});
