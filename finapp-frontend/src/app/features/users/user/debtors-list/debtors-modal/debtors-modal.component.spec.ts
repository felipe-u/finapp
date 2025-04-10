import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsModalComponent } from './debtors-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DebtorsModalComponent', () => {
  let component: DebtorsModalComponent;
  let fixture: ComponentFixture<DebtorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DebtorsModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DebtorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
