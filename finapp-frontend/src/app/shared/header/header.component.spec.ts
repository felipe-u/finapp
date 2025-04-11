import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { ElementRef, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { ClientsService } from '../../core/services/clients.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserId',
      'getUserName',
      'getUserPhoto',
      'cleanStorage'
    ]);
    clientsServiceSpy = jasmine.createSpyObj('ClientsService', ['cleanStorage']);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: ClientsService, useValue: clientsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    usersServiceSpy.getUserId.and.returnValue(signal('123'));
    usersServiceSpy.getUserName.and.returnValue(signal('Test User'));
    usersServiceSpy.getUserPhoto.and.returnValue(signal('test-photo.jpg'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data on ngOnInit', () => {
    expect(component.userId()).toBe('123');
    expect(component.userName()).toBe('Test User');
    expect(component.userPhoto()).toBe('test-photo.jpg');
  });

  it('should open and close the side panel', () => {
    const mockSidepanel = {
      nativeElement: {
        setAttribute: jasmine.createSpy()
      }
    };
    component.sidepanel = mockSidepanel as unknown as ElementRef;

    component.openSidePanel();
    expect(mockSidepanel.nativeElement.setAttribute).toHaveBeenCalledWith('style', 'width: 250px');
    expect(component.isSidePanelOpen).toBeTrue();

    component.closeSidePanel();
    expect(mockSidepanel.nativeElement.setAttribute).toHaveBeenCalledWith('style', 'width: 0px');
    expect(component.isSidePanelOpen).toBeFalse();
  });

  it('should navigate to profile with correct URL', () => {
    spyOn(router, 'navigateByUrl');
    component.userId.set('456');
    component.goToProfile();
    expect(router.navigateByUrl).toHaveBeenCalledWith('account/456/profile');
  });

  it('should navigate to settings with correct URL', () => {
    spyOn(router, 'navigateByUrl');
    component.userId.set('789');
    component.goToSettings();
    expect(router.navigateByUrl).toHaveBeenCalledWith('account/789/settings');
  });

  it('should call services on logout', () => {
    component.onLogout();
    expect(usersServiceSpy.cleanStorage).toHaveBeenCalled();
    expect(clientsServiceSpy.cleanStorage).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should close side panel when clicking outside if not in account settings', () => {
    const mockSidepanel = {
      nativeElement: {
        contains: () => false,
        setAttribute: jasmine.createSpy()
      }
    };
    component.sidepanel = mockSidepanel as unknown as ElementRef;
    component.isSidePanelOpen = true;
    component.isInAccountSettings = false;

    const event = new MouseEvent('click');
    component.onDocumentClick(event);

    expect(mockSidepanel.nativeElement.setAttribute).toHaveBeenCalledWith('style', 'width: 0px');
    expect(component.isSidePanelOpen).toBeFalse();
  });
});