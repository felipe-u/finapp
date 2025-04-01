import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../core/services/notiflix.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  user = signal<any | undefined>(undefined);
  editMode = false;

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
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

  prepopulateForm() {
    this.changeEditMode();
    this.form.patchValue({
      email: this.user().email,
      phone: this.user().phone
    })
  }

  changeEditMode() {
    this.editMode = !this.editMode;
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
          this.user().language
        );
        this.usersService.updateUserInfo(this.user()._id, newEmail, newPhone).subscribe({
          next: () => {
            this.user.set(newUserInfo);
            this.changeEditMode();
            this.notiflix.showSuccess(
              this.translate.instant('NOTIFLIX.UPDATED')
            );
          },
          error: (error: Error) => {
            console.error(error.message);
            this.notiflix.showError(
              this.translate.instant('NOTIFLIX.ERROR')
            );
          }
        })
      }, () => { })
  }
}
