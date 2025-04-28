import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

describe('AppComponent', () => {
  let translateService: TranslateService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot(),
        RouterModule.forRoot([])
      ],
    }).compileComponents();
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set the default language to "en" if no language is stored in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(translateService, 'use');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith('es');
  });

  it('should set the language based on localStorage if available', () => {
    spyOn(localStorage, 'getItem').and.returnValue('en');
    spyOn(translateService, 'use');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should use browser language if no language is stored and browser language is available', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(translateService, 'use');
    spyOn(translateService, 'getBrowserLang').and.returnValue('en');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should call window.scrollTo when router events are triggered', (done) => {
    spyOn(window, 'scrollTo').and.callFake((options) => {
      expect(options).toEqual({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      done()
    });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    router.events.subscribe(() => {
      setTimeout(() => {
      }, 0);
    });

    router.navigate(['/home']);
  });
});
