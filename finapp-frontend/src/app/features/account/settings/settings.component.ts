import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private router = inject(Router);
  @Input() userId: string;

  goToProfile() {
    this.router.navigate(['account', 'profile']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
