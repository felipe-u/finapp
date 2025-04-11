import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportsComponent,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the button when no days gap is selected', () => {
    component.selectedDaysGap = '';
    expect(component.isButtonHidden()).toBeTrue();
  });

  it('should show the button when days gap is selected', () => {
    component.selectedDaysGap = '30';
    expect(component.isButtonHidden()).toBeFalse();
  });

  it('should hide days gap when report type is not "delinquency-report"', () => {
    component.selectedReport = 'other-report';
    expect(component.isDaysGapHidden()).toBeTrue();
  });

  it('should show days gap when report type is "delinquency-report"', () => {
    component.selectedReport = 'delinquency-report';
    expect(component.isDaysGapHidden()).toBeFalse();
  });

  it('should open the modal when onGenerateReport is called', () => {
    component.onGenerateReport();
    expect(component.isModalOpen).toBeTrue();
  });

  it('should close the modal when closeModal is called', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });
});
