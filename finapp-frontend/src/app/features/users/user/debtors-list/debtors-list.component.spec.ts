import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsListComponent } from './debtors-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('DebtorsListComponent', () => {
  let component: DebtorsListComponent;
  let fixture: ComponentFixture<DebtorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DebtorsListComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([])
      ]
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
