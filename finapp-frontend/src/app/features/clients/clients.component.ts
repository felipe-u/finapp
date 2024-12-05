import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private router = inject(Router);
  private clientsService = inject(ClientsService);
  private destroyRef = inject(DestroyRef);
  debtors = signal<any>([]);

  ngOnInit(): void {
    const subscription = this.clientsService.getAllDebtorsList().subscribe({
      next: (debtors) => {
        this.debtors.set(debtors)
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  showDebtors() {
    console.log(this.debtors());
  }

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
