import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { Financing } from '../../../../core/models/financing.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LoggingService } from '../../../../core/services/logging.service';

@Component({
  selector: 'app-financing',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TranslatePipe],
  templateUrl: './financing.component.html',
  styleUrl: './financing.component.css'
})
export class FinancingComponent implements OnInit {
  private clientsService = inject(ClientsService);
  private loggingService = inject(LoggingService);
  client = signal<any | undefined>(undefined);
  financing = signal<Financing>(undefined);

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientFinancing().subscribe({
      next: (financing) => {
        this.financing.set(financing);
      },
      error: (error: Error) => {
        this.loggingService.error(error.message);
      }
    });
  }
}
