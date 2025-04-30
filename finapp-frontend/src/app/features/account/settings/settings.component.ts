import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../../core/services/users.service';
import { NotiflixService } from '../../../core/services/notiflix.service';
import { VirtualDateService } from '../../../core/services/virtualDate.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslatePipe, FormsModule, DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private usersService = inject(UsersService);
  private notiflix = inject(NotiflixService);
  private virtualDateService = inject(VirtualDateService);
  @Input() userId: string;
  selectedLang: string;
  virtualDate = signal<Date>(null);

  ngOnInit(): void {
    const lang = this.usersService.getUserLang();
    this.selectedLang = lang();
    this.getVirtualDate();
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

  /* istanbul ignore next */
  getVirtualDate() {
    this.virtualDateService.getCurrentDate().subscribe({
      next: (date) => {
        const vDate = this.getDateWithoutTimezoneOffset(date);
        this.virtualDate.set(vDate);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  /* istanbul ignore next */
  setDate() {
    this.virtualDateService.setDate().subscribe()
  }

  /* istanbul ignore next */
  advanceDate(days: number) {
    const sendRequest = (createClients: boolean) => {
      this.virtualDateService.advanceDate(days, createClients).subscribe({
        next: () => {
          this.getVirtualDate()
          if (createClients) {
            this.notiflix.showInfo('Simulated client created')
          }
          this.notiflix.showInfo(
            days === 1
              ? 'Simulation advanced 1 day'
              : 'Simulation advanced 7 days'
          );
        },
        error: (err) => console.error(err)
      });
    };

    if (days === 1) {
      this.notiflix.showConfirm(
        'Simulación', '¿Incluir creación de usuarios?',
        () => sendRequest(true),
        () => sendRequest(false)
      );
    } else {
      sendRequest(false);
    }
  }

  /* istanbul ignore next */
  resetDate() {
    this.virtualDateService.resetDate().subscribe({
      next: () => {
        this.getVirtualDate();
        this.notiflix.showInfo('Simulation has been reset');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /* istanbul ignore next */
  getDateWithoutTimezoneOffset(incomingDate: string) {
    var date = new Date(incomingDate);
    var dateWithoutTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + dateWithoutTimezoneOffset)
  }
}
