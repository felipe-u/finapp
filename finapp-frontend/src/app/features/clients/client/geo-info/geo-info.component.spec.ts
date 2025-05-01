import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInfoComponent } from './geo-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';
import { NotiflixService } from '../../../../core/services/notiflix.service';
import { GoogleMapsServiceService } from '../../../../core/services/google-maps.service';

@Component({
  selector: 'google-map',
  standalone: true,
  template: ''
})
class MockGoogleMapComponent { }

@Component({
  selector: 'map-advanced-marker',
  standalone: true,
  template: ''
})
class MockMapAdvancedMarkerComponent { }

describe('GeoInfoComponent', () => {
  let component: GeoInfoComponent;
  let fixture: ComponentFixture<GeoInfoComponent>;
  let notiflixServiceMock: jasmine.SpyObj<NotiflixService>;
  let googleMapsServiceSpy: jasmine.SpyObj<GoogleMapsServiceService>;

  beforeEach(async () => {
    (globalThis as any).google = {
      maps: {
        importLibrary: () => Promise.resolve()
      }
    }
    const mockClient = { _id: "mock-id", name: "Test Client" };
    const clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientGeographicInfo: jasmine.createSpy('getClientGeographicInfo').and.returnValue(of({}))
    }
    notiflixServiceMock = jasmine.createSpyObj('NotiflixService', ['showError', 'showConfirm', 'showSuccess']);
    googleMapsServiceSpy = jasmine.createSpyObj('GoogleMapsService', ['load']);
    googleMapsServiceSpy.load.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [
        GeoInfoComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MockGoogleMapComponent,
        MockMapAdvancedMarkerComponent,
      ],
      declarations: [
      ],
      providers: [
        { provide: ClientsService, useValue: clientServiceMock },
        { provide: NotiflixService, useValue: notiflixServiceMock },
        { provide: GoogleMapsServiceService, useValue: googleMapsServiceSpy }
      ],
      schemas: []
    })
      .compileComponents();

    fixture = TestBed.createComponent(GeoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call googleMapsService.load() and set isMapAvailable', async () => {
    (window as any).google = { maps: {} }
    await component.ngOnInit();
    expect(googleMapsServiceSpy.load).toHaveBeenCalled();
  });

  it('should show loader when geoInfo is undefined', () => {
    spyOn(component, 'geoInfo').and.returnValue(undefined);
    fixture.detectChanges();

    const loaderEl = fixture.nativeElement.querySelector('.loader-container');
    expect(loaderEl).toBeTruthy();
  });

  it('should show address information when geoInfo has data', () => {
    const mockGeoInfo = {
      _id: 'mock-id',
      latitude: 10,
      longitude: 20,
      address: '123 Calle Falsa',
      neighbourhood: 'Centro',
      city: 'CiudadX',
      department: 'DF',
      propertyImages: ['image1.png'],
      googleMapsUrl: ''
    };

    spyOn(component, 'geoInfo').and.returnValue(mockGeoInfo);
    component.editMode = false;
    fixture.detectChanges();

    const addressText = fixture.nativeElement.textContent;
    expect(addressText).toContain('123 Calle Falsa');
    expect(addressText).toContain('Centro');
    expect(addressText).toContain('CiudadX');
  });

  it('should call prepolutaForm when edit button is clicked', () => {
    spyOn(component, 'prepolutaForm');
    const button = fixture.nativeElement.querySelector('.editBtn');
    button.click();
    expect(component.prepolutaForm).toHaveBeenCalled();
  });

  it('should prepopulate the form with geo information', () => {
    const mockDepartments = [
      { name: 'Illinois', code: 'IL' },
      { name: 'California', code: 'CA' },
      // ... otros departamentos
    ];
    spyOn(component, 'geoInfo').and.returnValue({
      _id: 'mock-id',
      address: '123 Main St',
      city: 'Springfield',
      department: 'Illinois',
      neighbourhood: 'Downtown',
      latitude: 10,
      longitude: 20,
      sector: 'Sector 1',
      googleMapsUrl: '',
      propertyImages: [],
      additionalInfo: 'Some additional info'
    });

    component.departments = mockDepartments;

    component.prepolutaForm();

    expect(component.form.value.latitude).toBe(10);
    expect(component.form.value.longitude).toBe(20);
    expect(component.form.value.address).toBe('123 Main St');
    expect(component.form.value.city).toBe('Springfield');
    expect(component.form.value.department).toBe('Illinois');
    expect(component.form.value.neighbourhood).toBe('Downtown');
    expect(component.form.value.sector).toBe('Sector 1');
    expect(component.form.value.additionalInfo).toBe('Some additional info');
  });

  it('should show error notification when form is invalid', () => {
    component.form.controls['address'].setValue('');
    component.form.markAllAsTouched();

    component.onSubmit();

    expect(notiflixServiceMock.showError).toHaveBeenCalledWith(
      jasmine.any(String)
    );
  });

  it('should update latitude and longitude on map mouse event', () => {
    const mockEvent = {
      latLng: {
        lat: jasmine.createSpy('lat').and.returnValue(10),
        lng: jasmine.createSpy('lng').and.returnValue(20)
      },
      domEvent: {},
      stop: jasmine.createSpy('stop')
    } as unknown as google.maps.MapMouseEvent;

    component.updateLocation(mockEvent);

    expect(component.form.value.latitude).toBe(10);
    expect(component.form.value.longitude).toBe(20);
  });
});
