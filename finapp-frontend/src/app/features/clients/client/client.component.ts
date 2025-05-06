import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ClientNavbarComponent } from "./client-navbar/client-navbar.component";
import { ClientsService } from '../../../core/services/clients.service';
import { LoggingService } from '../../../core/services/logging.service';


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, ClientNavbarComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit, OnDestroy {

  private activatedRoute = inject(ActivatedRoute);
  private clientsService = inject(ClientsService);
  private loggingService = inject(LoggingService);
  client = signal<any | undefined>(undefined);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientsService.findById(params.clientId).subscribe({
        next: (client) => {
          if (client.role === 'debtor') {
            this.clientsService.setCodebtorId(client.codebtor);
          }
          this.client.set(client);
          this.clientsService.setClient(client);
        },
        error: (error: Error) => {
          this.loggingService.error(error.message);
        }
      })
    })
  }

  ngOnDestroy(): void {
    this.clientsService.setClient(undefined);
    this.clientsService.setCodebtorId(undefined);
    this.clientsService.setDebtorId(undefined);
  }
}
