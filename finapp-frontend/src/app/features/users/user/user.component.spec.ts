import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UsersService } from '../../../core/services/users.service';
import { NotiflixService } from '../../../core/services/notiflix.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  const mockUser = {
    _id: '123',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '123456789',
    role: 'manager',
    password: 'hashedPassword',
    language: 'es',
    photo: ''
  };

  const mockUsersService = {
    findById: jasmine.createSpy('findById').and.returnValue(of(mockUser)),
    updateUserInfo: jasmine.createSpy('updateUserInfo').and.returnValue(of({}))
  };

  const mockNotiflixService = {
    showError: jasmine.createSpy('showError'),
    showConfirm: jasmine.createSpy('showConfirm').and.callFake((title, msg, onConfirm, onCancel) => onConfirm()),
    showSuccess: jasmine.createSpy('showSuccess')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: of({ userId: '123' }) } },
        { provide: UsersService, useValue: mockUsersService },
        { provide: NotiflixService, useValue: mockNotiflixService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user()).toEqual(mockUser);
  });

  it('should prepopulate the form with user data', () => {
    component.user.set(mockUser);
    component.prepopulateForm();
    expect(component.form.value.email).toBe(mockUser.email);
    expect(component.form.value.phone).toBe(mockUser.phone);
    expect(component.editMode).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({ email: '', phone: '' });
    component.onSubmit();
    expect(component.form.invalid).toBeTrue();
    expect(mockNotiflixService.showError).toHaveBeenCalled();
  });

  it('should submit form and update user', () => {
    component.user.set(mockUser);
    component.form.setValue({
      email: 'nuevo@email.com',
      phone: '987654321'
    });
    component.onSubmit();
    expect(mockNotiflixService.showSuccess).toHaveBeenCalled();
    expect(component.user().email).toBe('nuevo@email.com');
    expect(component.user().phone).toBe('987654321');
    expect(component.editMode).toBeTrue();
  });
});
