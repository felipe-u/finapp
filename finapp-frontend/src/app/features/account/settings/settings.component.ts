import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../core/services/users.service';
import { NotiflixService } from '../../../core/services/notiflix.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private usersService = inject(UsersService);
  private notiflix = inject(NotiflixService);
  @Input() userId: string;
  selectedLang: string;

  ngOnInit(): void {
    const lang = this.usersService.getUserLang();
    this.selectedLang = lang();
  }

  selectLanguage() {
    if (this.selectedLang) {
      this.notiflix.showConfirm(
        this.translate.instant('NOTIFLIX.CHANGE_LANG'),
        this.translate.instant('NOTIFLIX.CHANGE_LANG_CONFIRM'),
        () => {
          const userId = this.usersService.getUserId();
          this.usersService.changeUserLang(
            userId(), this.selectedLang
          ).subscribe({
            next: () => {
              this.translate.use(this.selectedLang);
              this.notiflix.showLoading();
              localStorage.setItem('lang', this.selectedLang);
              this.notiflix.hideLoading();
              this.notiflix.showSuccess(
                this.translate.instant('NOTIFLIX.LANG_SUCCESS')
              );
            },
            error: (error: Error) => {
              console.error(error.message);
              this.notiflix.showError(
                this.translate.instant('NOTIFLIX.ERROR')
              );
            }
          })
        },
        () => { }
      )
    }
  }

  goToProfile() {
    this.router.navigate(['account', 'profile']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
