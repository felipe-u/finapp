import { Component, inject, OnInit, signal } from '@angular/core';
import { DebtorsModalComponent } from "./debtors-modal/debtors-modal.component";
import { ClientsService } from '../../../../core/services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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
    if (confirm('Are you sure you want to remove this debtor?')) {
      this.clientsService.removeDebtorFromManager(debtorId)
        .subscribe({
          next: () => {
            this.updateDebtorsList();
          },
          error: (error: Error) => {
            console.error(error.message);
          }
        });
    }
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
