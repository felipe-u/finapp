import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInfoComponent } from './geo-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';

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

  beforeEach(async () => {
    const mockClient = { _id: "mock-id", name: "Test Client" };
    const clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientGeographicInfo: jasmine.createSpy('getClientGeographicInfo').and.returnValue(of({}))
    }
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
        { provide: ClientsService, useValue: clientServiceMock }
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
});
