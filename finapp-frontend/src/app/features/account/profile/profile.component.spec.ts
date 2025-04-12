import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ userId: "123" })
            }
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle editMode when changeEditMode is called', () => {
    expect(component.editMode).toBeFalse();
    component.changeEditMode();
    expect(component.editMode).toBeTrue();
    component.changeEditMode();
    expect(component.editMode).toBeFalse()
  })

  it('should patch the form with user data on onPrepopulateForm', () => {
    const mockUser = {
      _id: '123',
      name: 'Test',
      role: 'user',
      email: 'test@test.com',
      password: '1234',
      phone: '123456789',
      photo: ''
    };

    component.user.set(mockUser);
    component.onPrepopulateForm();

    expect(component.editMode).toBeTrue();
    expect(component.form.value).toEqual({
      email: mockUser.email,
      phone: mockUser.phone
    });
  });

  it('should mark all as touched and show error if form is invalid', () => {
    const notiflixSpy = spyOn(component['notiflix'], 'showError');
    component.form.setValue({ email: '', phone: '' });
    component.onSubmit();
    expect(component.form.touched).toBeTrue();
    expect(notiflixSpy).toHaveBeenCalled();
  });

  it('should update user info on valid submit and confirm', () => {
    const mockUser = {
      _id: '123',
      name: 'Test',
      role: 'user',
      email: 'old@test.com',
      password: '1234',
      phone: '123456789',
      photo: 'photo.jpg'
    };
    component.user.set(mockUser);

    component.form.setValue({
      email: 'new@test.com',
      phone: '987654321'
    });

    spyOn(component['notiflix'], 'showConfirm').and.callFake((_, __, yesFn) => yesFn());

    const updateSpy = spyOn(component['usersService'], 'updateUserInfo').and.returnValue(of({}));
    const successSpy = spyOn(component['notiflix'], 'showSuccess');

    component.onSubmit();

    expect(updateSpy).toHaveBeenCalledWith('123', 'new@test.com', '987654321');
    expect(successSpy).toHaveBeenCalled();
    expect(component.editMode).toBeTrue();
  });

  it('should open and close password modal', () => {
    expect(component.isPasswordModalOpen).toBeFalse();
    component.onChangePassword();
    expect(component.isPasswordModalOpen).toBeTrue();
    component.closePasswordModal();
    expect(component.isPasswordModalOpen).toBeFalse();
  });

  it('should open and close profile picture modal', () => {
    expect(component.isProfilePictureModalOpen).toBeFalse();
    component.openProfilePictureModal();
    expect(component.isProfilePictureModalOpen).toBeTrue();
    component.closeProfilePictureModal();
    expect(component.isProfilePictureModalOpen).toBeFalse();
  });

  it('should update the user photo URL', () => {
    const mockUser = {
      _id: '123',
      name: 'Test',
      role: 'user',
      email: 'test@test.com',
      password: '1234',
      phone: '123456789',
      photo: ''
    };
    component.user.set(mockUser);
    component.updateUserPhoto('newPhoto.jpg');
    expect(component.user().photo).toBe('newPhoto.jpg');
  });
});
