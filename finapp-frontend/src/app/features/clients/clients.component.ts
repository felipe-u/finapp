import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  private router = inject(Router);

  clients = [
    { idNumber: '001', name: 'Andres Deudor', status: 'Al día' },
    { idNumber: '002', name: 'Carla Deudora', status: 'En mora' }
  ]

  options = [
    { key: 'AD', name: 'Al dia', selected: true },
    { key: 'EM', name: 'En mora', selected: false },
    { key: 'CT', name: 'Completada', selected: false },
    { key: 'CP', name: 'En cobro prejurídico', selected: false },
    { key: 'CJ', name: 'En cobro jurídico', selected: false },
  ]

  openClientProfile(clientId: string) {
    this.router.navigate(['clients', clientId]);
  }
}
