import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancingComponent } from './financing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ClientsService } from '../../../../core/services/clients.service';
import { TranslateModule } from '@ngx-translate/core';
import { statusEnum } from '../../../../core/models/enums';

describe('FinancingComponent', () => {
  let component: FinancingComponent;
  let fixture: ComponentFixture<FinancingComponent>;

  beforeEach(async () => {
    const mockClient = { _id: "mock-id", name: "Test Client" };
    const clientServiceMock = {
      getClient: () => signal(mockClient),
      getClientFinancing: jasmine.createSpy('getClientFinancing').and.returnValue(of({}))
    }
    await TestBed.configureTestingModule({
      imports: [
        FinancingComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FinancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display financed amount when financing is loaded', () => {
    component.financing.set({
      _id: "mock-id",
      initialInstallment: 1000000,
      financedAmount: 5000000,
      numberOfInstallments: 12,
      monthlyInterest: 2.5,
      lateInterests: 5,
      totalToPay: 6000000,
      installments: [],
      status: statusEnum['AD'],
      motorcycle: null
    });
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('table tr');
    const financedAmountCell = rows[1].children[1];
    expect(financedAmountCell.textContent).toContain('5,000,000');
  });
});
