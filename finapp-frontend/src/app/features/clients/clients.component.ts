import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { query } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private router = inject(Router);
  private clientsService = inject(ClientsService);
  private destroyRef = inject(DestroyRef);
  debtors = signal<any>([]);
  searchTerm = '';
  // options = [
  //   { key: 'AD', name: 'Al dia', selected: true },
  //   { key: 'EM', name: 'En mora', selected: true },
  //   { key: 'CT', name: 'Completada', selected: true },
  //   { key: 'CP', name: 'En cobro prejurídico', selected: true },
  //   { key: 'CJ', name: 'En cobro jurídico', selected: true },
  // ];
  options = [
    { key: 'AD', name: 'Up to date', selected: true },
    { key: 'EM', name: 'Overdue', selected: true },
    { key: 'CT', name: 'Completed', selected: true },
    { key: 'CP', name: 'Pre-legal collection', selected: true },
    { key: 'CJ', name: 'Legal collection', selected: true },
  ];
  filterForm = new FormGroup({
    AD: new FormControl(true),
    EM: new FormControl(true),
    CT: new FormControl(true),
    CP: new FormControl(true),
    CJ: new FormControl(true),
  })

  ngOnInit(): void {
    const subscription = this.clientsService.getDebtorsList().subscribe({
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

  filterByStatuses() {
    const selectedStatuses = Object.keys(this.filterForm.value).filter(key => this.filterForm.value[key]);
    this.clientsService.getDebtorsByStatuses(selectedStatuses).subscribe({
      next: (debtors) => {
        this.debtors.set(debtors);
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
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
      // console.log('El término de búsqueda contiene letras y números.');
      console.log('The search term contains letters and numbers');
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
      // console.log('El término de búsqueda no contiene ni letras ni números.');
      console.log('The search term contains no letters or numbers');
    }
  }

  openClientProfile(clientId: string) {
    this.router.navigate(['clients', clientId]);
  }
}
