import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private router = inject(Router);
  private translateService = inject(TranslateService);
  @Input() userId: string;
  selectedLang: string;

  selectLanguage() {
    if (this.selectedLang) {
      this.translateService.use(this.selectedLang);
    }
  }

  goToProfile() {
    this.router.navigate(['account', 'profile']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
