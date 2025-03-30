import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { PasswordModalComponent } from "./password-modal/password-modal.component";
import { ProfilePictureModalComponent } from "../../../shared/profile-picture-modal/profile-picture-modal.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModalComponent, ProfilePictureModalComponent, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
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
          console.log(user);
        },
        error: (error: Error) => {
          console.error(error.message);
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
    if (confirm('Confirmar cambios')) {
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
          this.user.set(newUserInfo);
          this.changeEditMode();
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      })
    }
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
