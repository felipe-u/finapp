import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private router = inject(Router);
  private clientsService = inject(ClientsService);
  private destroyRef = inject(DestroyRef);
  debtors = signal<any>([]);
  searchTerm = '';

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

  searchClient() {
    const searchTerm = this.searchTerm;
    if (searchTerm !== '') {
      this.validateInput();
    }
  }

  validateInput() {
    const hasLetters = /[a-zA-Z]/.test(this.searchTerm);
    const hasNumbers = /\d/.test(this.searchTerm);
    if (hasLetters && hasNumbers) {
      console.log('El término de búsqueda contiene letras y números.');
    } else if (hasLetters || hasNumbers) {
      const searchType = hasLetters ? "name" : "identification";
      console.log(`We're searching by ${searchType}.`);
      this.clientsService.getDebtorsBySearchTerm(this.searchTerm).subscribe({
        next: (debtors) => {
          this.debtors.set(debtors);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      });
    } else {
      console.log('El término de búsqueda no contiene ni letras ni números.');
    }
  }
}
