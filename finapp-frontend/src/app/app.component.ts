import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private httpClient = inject(HttpClient);
  url = 'http://localhost:3000/';
  users = signal<any>(undefined)

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
  })

  onSubmit() {
    const userName = this.form.value.name;
    const userEmail = this.form.value.email;
    const newUser = new User(null, userName, userEmail);
    this.httpClient.post(this.url + 'create-user', newUser).subscribe();
    this.form.reset();
  }

  getUsers() {
    this.httpClient.get(this.url + 'users').subscribe({
      next: (resultData) => {
        this.users.set(resultData['users']);
      }
    })
  }
}
