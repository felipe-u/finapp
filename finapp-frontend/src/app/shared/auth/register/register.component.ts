import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../../core/services/notiflix.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private clientsService = inject(ClientsService);
  private usersService = inject(UsersService);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required]
    }),
    role: new FormControl('', {
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.required]
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required]
    }),
  },
    { validators: matchPasswordValidator })

  onSubmit() {
    if (this.form.hasError('passwordMismatch')) {
      this.notiflix.showError(
        this.translate.instant('NOTIFLIX.PASS_MUST_MATCH')
      );
      return
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notiflix.showError(
        this.translate.instant('NOTIFLIX.ALL_FIELDS_ERROR')
      );
      return;
    }
    const { name, role, email, phone, password } = this.form.value;
    const newUser = new User(
      '',
      name,
      role as 'admin' | 'manager' | 'assistant',
      email,
      password,
      phone,
      'es',
      ''
    );
    this.authService.register(newUser).subscribe({
      next: (res) => {
        if (res.user.role === 'manager') {
          this.clientsService.setManagerId(res.user._id);
        }
        this.usersService.setUserId(res.user._id);
        this.usersService.setUserRole(res.user.role);
        this.usersService.setUserName(res.user.name);
        this.usersService.setUserEmail(res.user.email);
        this.usersService.setUserPhoto(res.user.photo);
        this.usersService.setUserLang(res.user.lang);
        localStorage.setItem('lang', res.user.lang);

        this.router.navigateByUrl('home');
      },
      error: (err) => {
        console.error(err.message);
        this.notiflix.showError(
          this.translate.instant('NOTIFLIX.ERROR')
        );
      }
    })
  }

}

export const matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true }
};