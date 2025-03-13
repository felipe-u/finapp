import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  private router = inject(Router);

  goToSettings() {
    this.router.navigate(['account', 'settings'])
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
