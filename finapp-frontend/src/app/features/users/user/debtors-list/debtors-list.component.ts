import { Component, inject } from '@angular/core';
import { DebtorsModalComponent } from "./debtors-modal/debtors-modal.component";

@Component({
  selector: 'app-debtors-list',
  standalone: true,
  imports: [DebtorsModalComponent],
  templateUrl: './debtors-list.component.html',
  styleUrl: './debtors-list.component.css'
})
export class DebtorsListComponent {
  managingDebtors = false;
  isModalOpen = false;
  testUsers = [
    {
      idNumber: '11111001000',
      name: 'Samuel Vélez',
      status: 'Al día'
    },
    {
      idNumber: '22222001000',
      name: 'Pedro Silva',
      status: 'En mora'
    },
    {
      idNumber: '33333001000',
      name: 'Bruger Express',
      status: 'Al día'
    },
  ]

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
  }
}
