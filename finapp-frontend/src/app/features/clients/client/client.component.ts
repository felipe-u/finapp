import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ClientNavbarComponent } from "./client-navbar/client-navbar.component";
import { ClientsService } from '../../../core/services/clients.service';


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, ClientNavbarComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientsService.findById(params.clientId).subscribe({
        next: (client) => {
          this.client.set(client);
          this.clientsService.setClient(client);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      })
    })
  }

}
