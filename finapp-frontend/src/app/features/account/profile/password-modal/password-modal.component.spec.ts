import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PasswordModalComponent } from './password-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { UsersService } from '../../../../core/services/users.service';

describe('PasswordModalComponent', () => {
  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;
  let usersServiceMock: any;

  beforeEach(async () => {
    usersServiceMock = {
      checkUserPassword: jasmine.createSpy('checkUserPassword').and.returnValue(of(true))
    };

    await TestBed.configureTestingModule({
      imports: [
        PasswordModalComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    (component as any).userId = 'mockUserId';
    component['oldPasswordForm'] = new FormGroup({
      oldPassword: new FormControl('test123')
    });
    component['isOldPasswordWrongOrNotEnteredYet'] = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display old password form if isOldPasswordWrongOrNotEnteredYet is true', () => {
    const formElement = fixture.debugElement.query(By.css('form'))
    expect(formElement).toBeTruthy();
    expect(formElement.nativeElement.innerHTML).toContain('oldPassword')
  })

  it('should call checkPassword() when old password form is submitted', () => {
    const spy = spyOn(component as any, 'checkPassword').and.callThrough();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalled();
    expect(usersServiceMock.checkUserPassword).toHaveBeenCalledWith('mockUserId', 'test123')
    expect(component['isOldPasswordWrongOrNotEnteredYet']).toBeFalse();
  });
});
