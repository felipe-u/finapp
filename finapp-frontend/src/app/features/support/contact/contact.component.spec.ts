import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { EmailService } from '../../../core/services/email.service';
import { UsersService } from '../../../core/services/users.service';
import { NotiflixService } from '../../../core/services/notiflix.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let notiflixSpy: jasmine.SpyObj<NotiflixService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: EmailService,
          useValue: jasmine.createSpyObj('EmailService', ['sendEmail'])
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('UsersService', ['getUserEmail'])
        },
        {
          provide: NotiflixService,
          useValue: jasmine.createSpyObj('NotiflixService', ['showError', 'showSuccess'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    emailServiceSpy = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    notiflixSpy = TestBed.inject(NotiflixService) as jasmine.SpyObj<NotiflixService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if form is invalid on submit', () => {
    component.form.setValue({ subject: '', message: '' });
    component.onSubmit();
    expect(component.form.touched).toBeTrue();
    expect(notiflixSpy.showError).toHaveBeenCalled();
  });

  it('should send email and show success if form is valid', () => {
    component.form.setValue({ subject: 'Test subject', message: 'Test message' });
    usersServiceSpy.getUserEmail.and.returnValue(signal('test@example.com'));
    emailServiceSpy.sendEmail.and.returnValue(of({}));

    component.onSubmit();

    expect(emailServiceSpy.sendEmail).toHaveBeenCalledWith({
      from: 'test@example.com',
      subject: 'Test subject',
      body: 'Test message'
    });
    expect(notiflixSpy.showSuccess).toHaveBeenCalled();
    expect(component.form.value).toEqual({ subject: null, message: null });
  });

  it('should show error if emailService returns error', () => {
    component.form.setValue({ subject: 'Test', message: 'Message' });
    usersServiceSpy.getUserEmail.and.returnValue(signal('test@example.com'));
    emailServiceSpy.sendEmail.and.returnValue(throwError(() => new Error('Failed')));

    component.onSubmit();

    expect(notiflixSpy.showError).toHaveBeenCalled();
  });

  it('should navigate back to support page', () => {
    component.goBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('support');
  });
});