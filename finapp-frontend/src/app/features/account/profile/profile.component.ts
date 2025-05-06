import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { PasswordModalComponent } from "./password-modal/password-modal.component";
import { ProfilePictureModalComponent } from "../../../shared/profile-picture-modal/profile-picture-modal.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../core/services/notiflix.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordModalComponent,
    ProfilePictureModalComponent,
    TranslatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  private loggingService = inject(LoggingService);
  user = signal<any | undefined>(undefined);
  editMode = false;
  isPasswordModalOpen = false;
  isProfilePictureModalOpen = false;

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this.activatedRoute.parent.params.subscribe(params => {
      this.usersService.findById(params.userId).subscribe({
        next: (user) => {
          this.user.set(user);
        },
        error: (error: Error) => {
          this.loggingService.error(error.message);
        }
      })
    })
  }

  onPrepopulateForm() {
    this.changeEditMode();
    this.form.patchValue({
      email: this.user().email,
      phone: this.user().phone
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notiflix.showError(
        this.translate.instant('NOTIFLIX.ALL_FIELDS_ERROR')
      );
      return;
    }
    this.notiflix.showConfirm(
      this.translate.instant('NOTIFLIX.CONFIRM_CHANGES'),
      this.translate.instant('NOTIFLIX.YOU_SURE_UPD'),
      () => {
        const newEmail = this.form.value.email;
        const newPhone = this.form.value.phone;
        const newUserInfo = new User(
          this.user()._id,
          this.user().name,
          this.user().role,
          newEmail,
          this.user().password,
          newPhone,
          this.user().photo
        );
        this.usersService.updateUserInfo(
          this.user()._id, newEmail, newPhone
        ).subscribe({
          next: () => {
            this.user.set({ ...newUserInfo, photo: this.user().photo });
            this.changeEditMode();
            this.notiflix.showSuccess(
              this.translate.instant('NOTIFLIX.UPDATED')
            );
          },
          error: (error: Error) => {
            this.loggingService.error(error.message);
            this.notiflix.showError(
              this.translate.instant('NOTIFLIX.ERROR')
            );
          }
        })
      },
      () => { }
    )
  }

  onChangePassword() {
    this.isPasswordModalOpen = true;
  }

  closePasswordModal() {
    this.isPasswordModalOpen = false;
  }

  openProfilePictureModal() {
    this.isProfilePictureModalOpen = true;
  }

  closeProfilePictureModal() {
    this.isProfilePictureModalOpen = false;
  }

  updateUserPhoto(newImageUrl: string) {
    this.user().photo = newImageUrl;
  }

  changeEditMode() {
    this.editMode = !this.editMode;
  }
}
