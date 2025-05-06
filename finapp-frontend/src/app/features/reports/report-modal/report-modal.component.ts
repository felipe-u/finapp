import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ClientsService } from '../../../core/services/clients.service';
import { PdfService } from '../../../core/services/pdf.service';
import { XlsxService } from '../../../core/services/xlsx.service';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css'
})
export class ReportModalComponent implements OnInit {
  private clientsService = inject(ClientsService);
  private pdfService = inject(PdfService);
  private xlsxService = inject(XlsxService);
  private loggingService = inject(LoggingService);
  @Output() close = new EventEmitter<void>();
  @Input() reportType: string;
  @Input() daysGap: string;
  debtorsInfo = signal<any>([]);
  loadingData = false;

  ngOnInit(): void {
    this.loadingData = true;
    this.clientsService.getDebtorsForReport(
      this.reportType, this.daysGap
    ).subscribe({
      next: (result) => {
        this.debtorsInfo.set(result);
        this.loadingData = false;
      },
      error: (error) => {
        this.loggingService.error(error.message);
        this.loadingData = false;
      }
    })
  }

  generatePDF() {
    this.pdfService.generatePDF(this.debtorsInfo());
  }

  generateExcel() {
    this.xlsxService.exportToExcel(this.debtorsInfo());
  }

  closeModal() {
    this.close.emit();
  }
}
