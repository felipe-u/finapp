import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ClientsService } from '../../../../../core/services/clients.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../../../core/services/notiflix.service';

@Component({
  selector: 'app-debtors-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './debtors-modal.component.html',
  styleUrl: './debtors-modal.component.css'
})
export class DebtorsModalComponent {
  private clientsService = inject(ClientsService);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  @Output() close = new EventEmitter<void>();
  @Output() updateDebtors = new EventEmitter<void>();
  @Input() managerId: string;
  searchTerm = '';
  showingDebtorsWithoutAssignment = false;
  showingSearchBar = false;
  showingDebtorsFound = false;
  debtorsWithoutAssignment = signal<any>([]);
  debtorsFound = signal<any>([]);

  onCancel() {
    this.close.emit();
  }

  searchClient() {
    const searchTerm = this.searchTerm;
    if (searchTerm !== '') {
      this.validateInput();
    }
  }

  showDebtorsWithoutAssignent() {
    this.showingDebtorsWithoutAssignment = true;
    this.updateDebtorsWithoutAssignment();
  }

  onAddToManager(debtorId: string, action: string) {
    let post_action: string;
    if (action === 'ass') {
      post_action = this.translate.instant('NOTIFLIX.ASSIGNED');
      action = this.translate.instant('NOTIFLIX.ASSIGN');
    } else if (action === 'rea') {
      post_action = this.translate.instant('NOTIFLIX.REASSIGNED');
      action = this.translate.instant('NOTIFLIX.REASSIGN');
    }
    this.notiflix.showConfirm(
      action.toUpperCase(),
      this.translate.instant('NOTIFLIX.YOU_SURE_ACTION', { action }),
      () => {
        this.clientsService.assignDebtorToManager(debtorId)
          .subscribe({
            next: () => {
              this.updateDebtorsWithoutAssignment();
              this.updateDebtorsFound();
              this.updateDebtors.emit();
              this.notiflix.showSuccess(
                this.translate.instant('NOTIFLIX.SUCCESS_ACTION', { post_action })
              );
            },
            error: (error: Error) => {
              console.error(error.message);
              this.notiflix.showError(
                this.translate.instant('NOTIFLIX.ERROR')
              );
            }
          });
      },
      () => { }
    );
  }

  showSearchBar() {
    this.showingSearchBar = true;
  }

  goToMenu() {
    this.showingSearchBar = false;
    this.showingDebtorsWithoutAssignment = false;
    this.showingDebtorsFound = false;
    this.searchTerm = '';
  }

  private validateInput() {
    const hasLetters = /[a-zA-Z]/.test(this.searchTerm);
    const hasNumbers = /\d/.test(this.searchTerm);
    if (hasLetters && hasNumbers) {
      console.log('The search term contains letters and numbers');
    } else if (hasLetters || hasNumbers) {
      const searchType = hasLetters ? "name" : "identification";
      console.log(`We're searching by ${searchType}.`);
      this.updateDebtorsFound();
    } else {
      console.log('The search term contains no letters or numbers');
    }
  }

  private updateDebtorsFound() {
    this.clientsService.getAllDebtorsBySearchTerm(this.searchTerm)
      .subscribe({
        next: (debtors) => {
          if (debtors.length > 0) {
            this.showingDebtorsFound = true;
          }
          this.debtorsFound.set(debtors);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      });
  }

  private updateDebtorsWithoutAssignment() {
    this.clientsService.getDebtorsWithoutAssignment()
      .subscribe({
        next: (debtors) => {
          this.debtorsWithoutAssignment.set(debtors);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      });
  }
}