import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EnumPipe } from '../../core/pipes/enum.pipe';
import { LoggingService } from '../../core/services/logging.service';
import { LogMessages } from '../../core/utils/log-messages';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    EnumPipe
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private router = inject(Router);
  private clientsService = inject(ClientsService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private loggingService = inject(LoggingService);
  debtors = signal<any>([]);
  searchTerm = '';
  options = [
    {
      key: 'AD',
      name: this.translate.instant('ENUMS.STATUS.AD'),
      selected: true
    },
    {
      key: 'EM',
      name: this.translate.instant('ENUMS.STATUS.EM'),
      selected: true
    },
    {
      key: 'CT',
      name: this.translate.instant('ENUMS.STATUS.CT'),
      selected: true
    },
    {
      key: 'CP',
      name: this.translate.instant('ENUMS.STATUS.CP'),
      selected: true
    },
    {
      key: 'CJ',
      name: this.translate.instant('ENUMS.STATUS.CJ'),
      selected: true
    },
  ];
  filterForm = new FormGroup({
    AD: new FormControl(true),
    EM: new FormControl(true),
    CT: new FormControl(true),
    CP: new FormControl(true),
    CJ: new FormControl(true),
  })

  ngOnInit(): void {
    const subscription = this.clientsService.getDebtorsList()
      .subscribe({
        next: (debtors) => {
          this.debtors.set(debtors)

        },
        error: (error: Error) => {
          this.loggingService.error(error.message);
        }
      })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  filterByStatuses() {
    const selectedStatuses = Object.keys(this.filterForm.value)
      .filter(key => this.filterForm.value[key]);
    this.clientsService.getDebtorsByStatuses(selectedStatuses)
      .subscribe({
        next: (debtors) => {
          this.debtors.set(debtors);
        },
        error: (error: Error) => {
          this.loggingService.error(error.message);
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
      this.loggingService.log(LogMessages.NUMBERS_AND_LETTERS);
    } else if (hasLetters || hasNumbers) {
      const searchType = hasLetters ? "name" : "identification";
      this.loggingService.log(LogMessages.SEARCHING(searchType))
      this.clientsService.getDebtorsBySearchTerm(this.searchTerm).subscribe({
        next: (debtors) => {
          this.debtors.set(debtors);
        },
        error: (error: Error) => {
          this.loggingService.error(error.message);
        }
      });
    } else {
      this.loggingService.log(LogMessages.NO_NUMBERS_NOR_LETTERS);
    }
  }

  openClientProfile(clientId: string) {
    this.router.navigate(['clients', clientId]);
  }
}
