import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../core/services/users.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../../core/services/notiflix.service';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css'
})
export class PasswordModalComponent {
  private usersService = inject(UsersService);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  @Output() close = new EventEmitter<void>();
  @Input() userId: string;
  isOldPasswordWrongOrNotEnteredYet = true;

  oldPasswordForm = new FormGroup({
    oldPassword: new FormControl('', {
      validators: [Validators.required]
    })
  })

  newPasswordForm = new FormGroup({
    newPassword: new FormControl('', {
      validators: [Validators.required]
    })
  })

  checkPassword() {
    const oldPassword = this.oldPasswordForm.value.oldPassword;
    this.usersService.checkUserPassword(this.userId, oldPassword).subscribe({
      next: (isCorrect) => {
        if (isCorrect) {
          this.isOldPasswordWrongOrNotEnteredYet = false;
        } else {
          this.notiflix.showError(
            this.translate.instant('NOTIFLIX_WRONG_PASS')
          );
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  onSubmit() {
    const newPassword = this.newPasswordForm.value.newPassword;
    this.usersService.changePassword(this.userId, newPassword).subscribe({
      next: () => {
        this.notiflix.showSuccess(
          this.translate.instant('NOTIFLIX.PASS_CHANGED')
        );
        this.closeModal();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  changeView() {
    this.isOldPasswordWrongOrNotEnteredYet = !this.isOldPasswordWrongOrNotEnteredYet;
  }

  closeModal() {
    this.close.emit();
  }
}
