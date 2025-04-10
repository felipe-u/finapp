import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async () => {
    const mockClient = {
      _id: "mock-id",
      name: "Test Client",
      identification: {
        number: "123456789"
      }
    };
    const clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientPersonalInfo: jasmine.createSpy("getClientPersonalInfo").and.returnValue(of({
        birthDate: new Date("2000-01-01"),
        photo: "",
        email: "test@mail.com",
        phone: "123456789",
        _id: 'mock-personal-id'
      }))
    }
    await TestBed.configureTestingModule({
      imports: [
        PersonalInfoComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientServiceMock }
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
});
