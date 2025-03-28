import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private clientsService = inject(ClientsService);
  private usersService = inject(UsersService);
  private router = inject(Router);

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
    this.authService.login(email, password).subscribe(res => {
      if (res.user.role === 'manager') {
        this.clientsService.setManagerId(res.user._id);
      }
      this.usersService.setUserId(res.user._id);
      this.usersService.setUserRole(res.user.role);
      this.usersService.setUserName(res.user.name);
      this.usersService.setUserPhoto(res.user.photo);
      this.usersService.setUserEmail(res.user.email);

      this.router.navigateByUrl('/home');
    })
  }
}
