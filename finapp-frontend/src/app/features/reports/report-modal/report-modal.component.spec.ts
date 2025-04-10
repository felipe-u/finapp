import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportModalComponent } from './report-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ReportModalComponent', () => {
  let component: ReportModalComponent;
  let fixture: ComponentFixture<ReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
