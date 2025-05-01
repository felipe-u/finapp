import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GoogleMapsServiceService } from './google-maps.service';

describe('GoogleMapsServiceService', () => {
  let service: GoogleMapsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsServiceService);
  });

  afterEach(() => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    (service as any).isLoaded = false;
    (service as any).loadPromise = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load Google Maps script and resolve promise', async () => {
    const promise = service.load();
    const script = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.async).toBeTrue();
    expect(script.defer).toBeTrue();

    script.onload?.(new Event('load'));

    await expectAsync(promise).toBeResolved();
  });

  it('should reject the promise if script fails to load', fakeAsync(() => {
    const promise = service.load();
  
    const script = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
    expect(script).toBeTruthy();
  
    let errorCaught = false;
    promise.catch(() => (errorCaught = true));
  
    script.onerror?.(new Event('error'));
    tick(); 
  
    expect(errorCaught).toBeTrue();
  }));

  it('should not load the script again if already loaded', async () => {
    const promise1 = service.load();

    const script = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
    script.onload?.(new Event('load'));
    await promise1;

    const promise2 = service.load();
    expect(promise2).toBe(promise1);
  });
});
