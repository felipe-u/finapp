import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersService } from '../../../core/services/users.service';
import { NotiflixService } from '../../../core/services/notiflix.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let notiflixSpy: jasmine.SpyObj<NotiflixService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUserId', 'getUserLang', 'changeUserLang']);
    notiflixSpy = jasmine.createSpyObj('NotiflixService', ['showConfirm', 'showLoading', 'hideLoading', 'showSuccess', 'showError']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant', 'use']);

    await TestBed.configureTestingModule({
      imports: [
        SettingsComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: NotiflixService, useValue: notiflixSpy },
        { provide: TranslateService, useValue: translateSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.selectedLang = 'en';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change language and update settings successfully', () => {
    const fakeUserId = '123';
    usersServiceSpy.getUserId.and.returnValue(signal(fakeUserId))
    usersServiceSpy.changeUserLang.and.returnValue(of({}));
    usersServiceSpy.getUserLang.and.returnValue(signal('es'));
    translateSpy.instant.and.callFake((key: string) => key);
    translateSpy.use.and.stub();
    notiflixSpy.showConfirm.and.callFake((title, message, onConfirm, onCancel) => onConfirm());

    component.selectLanguage();

    expect(usersServiceSpy.changeUserLang).toHaveBeenCalledWith(fakeUserId, 'en');
    expect(translateSpy.use).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(notiflixSpy.showLoading).toHaveBeenCalled();
    expect(notiflixSpy.hideLoading).toHaveBeenCalled();
    expect(notiflixSpy.showSuccess).toHaveBeenCalled();
  });
});
