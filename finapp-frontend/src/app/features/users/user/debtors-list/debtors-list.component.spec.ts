import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsListComponent } from './debtors-list.component';

describe('DebtorsListComponent', () => {
  let component: DebtorsListComponent;
  let fixture: ComponentFixture<DebtorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtorsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebtorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
