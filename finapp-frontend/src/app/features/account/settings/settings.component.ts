import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private usersService = inject(UsersService);
  @Input() userId: string;
  selectedLang: string;

  ngOnInit(): void {
    const lang = this.usersService.getUserLang();
    this.selectedLang = lang();
  }

  selectLanguage() {
    if (this.selectedLang) {
      const userId = this.usersService.getUserId();
      this.usersService.changeUserLang(
        userId(), this.selectedLang
      ).subscribe({
        next: () => {
          this.translateService.use(this.selectedLang);
          localStorage.setItem('lang', this.selectedLang);
        }
      })

    }
  }

  goToProfile() {
    this.router.navigate(['account', 'profile']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
