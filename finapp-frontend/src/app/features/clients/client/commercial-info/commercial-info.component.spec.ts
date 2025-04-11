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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loader if commercialInfo() is undefined', () => {
    spyOn(component, 'commercialInfo').and.returnValue(undefined);
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('.loader-container');
    expect(loader).toBeTruthy();
  });

  it('should show info table if commercialInfo() retrieve data', () => {
    spyOn(component, 'commercialInfo').and.returnValue({
      _id: 'mock-id',
      jobOccupation: 'Doctor',
      company: 'TechCorp',
      laborSenority: '5',
      income: 2000000,
      additionalIncome: 500000,
      expenses: 1000000,
    });
    component.editMode = false;
    fixture.detectChanges();

    const jobOccupation = fixture.nativeElement.querySelector('td:nth-child(2)');
    expect(jobOccupation?.textContent).toContain('Doctor');
  });
});
