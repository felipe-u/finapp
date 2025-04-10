import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInfoComponent } from './commercial-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';

describe('CommercialInfoComponent', () => {
  let component: CommercialInfoComponent;
  let fixture: ComponentFixture<CommercialInfoComponent>;

  beforeEach(async () => {
    const mockClient = { _id: "mock-id", name: "Test Client" };
    const clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientCommercialInfo: jasmine.createSpy('getClientCommercialInfo').and.returnValue(of({}))
    }
    await TestBed.configureTestingModule({
      imports: [
        CommercialInfoComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommercialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
