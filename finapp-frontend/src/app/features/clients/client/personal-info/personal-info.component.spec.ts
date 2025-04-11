import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';
import { idTypeEnum } from '../../../../core/models/identification.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NotiflixService } from '../../../../core/services/notiflix.service';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let mockNotiflix: any;
  let clientsServiceMock: any;

  beforeEach(async () => {

    const mockClient = {
      _id: "mock-id",
      name: "Test Client",
      identification: {
        idType: idTypeEnum['CC'],
        number: "123456789"
      }
    };

    mockNotiflix = {
      showError: jasmine.createSpy('showError'),
      showSuccess: jasmine.createSpy('showSuccess'),
      showConfirm: jasmine.createSpy('showConfirm').and.callFake((_title: string, _msg: string, onConfirm: () => void) => {
        onConfirm();
      })
    };

    clientsServiceMock = {
      getClient: () => signal(mockClient),
      getClientPersonalInfo: jasmine.createSpy("getClientPersonalInfo").and.returnValue(of({
        birthDate: new Date("2000-01-01"),
        photo: "",
        email: "test@mail.com",
        phone: "123456789",
        _id: 'mock-personal-id'
      })),
      editPersonalInfo: jasmine.createSpy("editPersonalInfo").and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        PersonalInfoComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientsServiceMock },
        { provide: NotiflixService, useValue: mockNotiflix }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prepopulate form with client data', () => {
    component.prepopulateForm();
    expect(component.form.value.idNumber).toBe("123456789");
    expect(component.form.value.email).toBe("test@mail.com");
    expect(component.form.value.phone).toBe("123456789");
    expect(component.form.value.birthDate).toBe("2000-01-01");
  });

  it('should show error if form is invalid on submit', () => {
    component.form.patchValue({ idNumber: '', email: '', phone: '', birthDate: '' });
    component.onSubmit();
    expect(mockNotiflix.showError).toHaveBeenCalled();
  });

  it('should call editPersonalInfo on valid submit', () => {
    component.prepopulateForm();
    component.onSubmit();
    expect(clientsServiceMock.editPersonalInfo).toHaveBeenCalled();
    expect(mockNotiflix.showSuccess).toHaveBeenCalled();
    expect(component.editMode).toBe(false);
  });

  it('should update client photo', () => {
    component.updateClientPhoto('new-url.jpg');
    expect(component.personalInfo().photo).toBe('new-url.jpg');
  });
});
