import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
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
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required]
    }),
  })

  onSubmit() {
    const { name, role, email, phone, password } = this.form.value;
    const newUser = new User('', name, role as 'admin' | 'manager' | 'assistant', email, password, phone)
    this.authService.register(newUser).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
  }
}
