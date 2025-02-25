import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-debtors-modal',
  standalone: true,
  imports: [],
  templateUrl: './debtors-modal.component.html',
  styleUrl: './debtors-modal.component.css'
})
export class DebtorsModalComponent {
  @Output() close = new EventEmitter<void>();
  showingDebtorsWithoutAssignment = false;
  showingSearchBar = false;

  onCancel() {
    this.close.emit();
  }

  showDebtorWithoutAssignent() {
    this.showingDebtorsWithoutAssignment = true;
  }

  showSearchBar() {
    this.showingSearchBar = true;
  }

  goToMenu() {
    this.showingSearchBar = false;
    this.showingDebtorsWithoutAssignment = false;
  }
}
