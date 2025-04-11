import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let clientsService: ClientsService;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    clientsService = TestBed.inject(ClientsService);
    usersService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on submit', () => {
    const spy = spyOn(authService, 'login').and.returnValue(of({
      user: {
        _id: '123',
        role: 'manager',
        name: 'Test User',
        photo: 'photo.jpg',
        email: 'test@example.com',
        lang: 'en'
      }
    }));

    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should redirect to /home on successful login', () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    spyOn(authService, 'login').and.returnValue(of({
      user: {
        _id: '456',
        role: 'assistant',
        name: 'Jane Doe',
        photo: 'img.jpg',
        email: 'jane@example.com',
        lang: 'es'
      }
    }));

    component.form.setValue({ email: 'jane@example.com', password: '123456' });
    component.onSubmit();

    expect(routerSpy).toHaveBeenCalledWith('/home');
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage when login fails', () => {
    spyOn(authService, 'login').and.returnValue(throwError(() => ({
      error: { message: 'Invalid credentials' }
    })));

    component.form.setValue({ email: 'wrong@example.com', password: 'wrong' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should disable the submit button if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button.disabled).toBeTrue();
  });
});