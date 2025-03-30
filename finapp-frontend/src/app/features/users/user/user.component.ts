import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { TranslatePipe } from '@ngx-translate/core';

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
  user = signal<any | undefined>(undefined);
  editMode = false;

  form = new FormGroup({
    //photo
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
    if (confirm("Confirmar cambios")) {
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
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      })
    }
  }
}
