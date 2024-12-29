import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { Financing } from '../../../../core/models/financing.model';

@Component({
  selector: 'app-financing',
  standalone: true,
  imports: [],
  templateUrl: './financing.component.html',
  styleUrl: './financing.component.css'
})
export class FinancingComponent implements OnInit {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  financing = signal<Financing>(undefined);

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientFinancing().subscribe({
      next: (financing) => {
        this.financing.set(financing);
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
  }
}
