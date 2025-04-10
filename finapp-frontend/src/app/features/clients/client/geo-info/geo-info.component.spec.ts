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
});
