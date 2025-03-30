import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';
import { TranslatePipe } from '@ngx-translate/core';

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
  })

  onSubmit() {
    const { name, role, email, phone, password } = this.form.value;
    const newUser = new User('', name, role as 'admin' | 'manager' | 'assistant', email, password, phone, 'es');
    this.authService.register(newUser).subscribe((res) => {
      if (res.user.role === 'manager') {
        this.clientsService.setManagerId(res.user._id);
      }
      this.usersService.setUserId(res.user._id);
      this.usersService.setUserRole(res.user.role);
      this.usersService.setUserName(res.user.name);
      this.usersService.setUserEmail(res.user.email);

      this.router.navigateByUrl('home');
    });
  }
}
