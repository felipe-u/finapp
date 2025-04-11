import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const form = component.form;
    expect(form.value).toEqual({
      name: '',
      role: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('should be invalid if required fields are missing', () => {
    component.form.patchValue({
      name: 'Juan',
      role: 'manager',
      email: '',
      phone: '123456',
      password: '1234',
      confirmPassword: '1234'
    });
    expect(component.form.invalid).toBeTrue();
  });

  it('should have passwordMismatch error if passwords do not match', () => {
    component.form.patchValue({
      password: '123456',
      confirmPassword: '654321'
    });
    expect(component.form.hasError('passwordMismatch')).toBeTrue();
  });

  it('should not have passwordMismatch error if passwords match', () => {
    component.form.patchValue({
      password: '123456',
      confirmPassword: '123456'
    });
    expect(component.form.hasError('passwordMismatch')).toBeFalse();
  });

  it('should show error if form is invalid or passwords do not match', () => {
    const spy = spyOn(component['notiflix'], 'showError');
    component.form.patchValue({
      name: '',
      role: '',
      email: '',
      phone: '',
      password: '123',
      confirmPassword: '456'
    });
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
});
