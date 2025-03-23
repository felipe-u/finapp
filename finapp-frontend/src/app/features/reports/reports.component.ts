import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportModalComponent } from "./report-modal/report-modal.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, ReportModalComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  private router = inject(Router);
  selectedReport: string = '';
  selectedDaysGap: string = '';
  isModalOpen = false;

  isButtonHidden() {
    return this.selectedDaysGap === '';
  }

  isDaysGapHidden() {
    return this.selectedReport !== 'delinquency-report';
  }

  onGenerateReport() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
