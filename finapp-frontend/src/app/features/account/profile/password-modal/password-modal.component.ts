import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css'
})
export class PasswordModalComponent {
  private usersService = inject(UsersService);
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
          alert('Incorrect password');
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
        alert('Password changed successfully');
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
