import { Component, inject, OnInit, signal } from '@angular/core';
import { DebtorsModalComponent } from "./debtors-modal/debtors-modal.component";
import { ClientsService } from '../../../../core/services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../../core/services/notiflix.service';

@Component({
  selector: 'app-debtors-list',
  standalone: true,
  imports: [DebtorsModalComponent, TranslatePipe],
  templateUrl: './debtors-list.component.html',
  styleUrl: './debtors-list.component.css'
})
export class DebtorsListComponent implements OnInit {
  private clientsService = inject(ClientsService);
  private activatedRoute = inject(ActivatedRoute);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  managerId = signal<string>('');
  debtors = signal<any>([]);
  managingDebtors = false;
  isModalOpen = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const managerId = params['userId'];
      this.clientsService.setManagerId(managerId);
      this.managerId.set(managerId);
      this.updateDebtorsList();
    })
  }

  onRemoveDebtor(debtorId: string) {
    const action = this.translate.instant('NOTIFLIX.REMOVE');
    const post_action = this.translate.instant('NOTIFLIX.REMOVED');
    this.notiflix.showConfirm(
      this.translate.instant('NOTIFLIX.CONFIRM_REM'),
      this.translate.instant('NOTIFLIX.YOU_SURE_ACTION', { action }),
      () => {
        this.clientsService.removeDebtorFromManager(debtorId)
          .subscribe({
            next: () => {
              this.updateDebtorsList();
              this.notiflix.showSuccess(
                this.translate.instant('NOTIFLIX.SUCCESS_ACTION', { post_action })
              )
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

  manageDebtors() {
    this.managingDebtors = true;
  }

  cancelManage() {
    this.managingDebtors = false;
  }

  openDebtorsModal() {
    this.isModalOpen = true;
  }

  closeDebtorsModal() {
    this.isModalOpen = false;
    this.updateDebtorsList();
  }

  updateDebtorsList() {
    this.clientsService.getDebtorsList().subscribe({
      next: (debtors) => {
        this.debtors.set(debtors);
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
  }
}
