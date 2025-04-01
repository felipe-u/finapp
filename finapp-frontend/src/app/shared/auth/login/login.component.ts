import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private clientsService = inject(ClientsService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  errorMessage = '';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onSubmit() {
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res.user.role === 'manager') {
          this.clientsService.setManagerId(res.user._id);
        }
        this.usersService.setUserId(res.user._id);
        this.usersService.setUserRole(res.user.role);
        this.usersService.setUserName(res.user.name);
        this.usersService.setUserPhoto(res.user.photo);
        this.usersService.setUserEmail(res.user.email);
        this.usersService.setUserLang(res.user.lang);
        this.errorMessage = '';
        localStorage.setItem('lang', res.user.lang);
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    })
  }
}
