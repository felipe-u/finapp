import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Email, EmailService } from '../../../core/services/email.service';
import { UsersService } from '../../../core/services/users.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private emailService = inject(EmailService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  form = new FormGroup({
    subject: new FormControl('', {
      validators: [Validators.required]
    }),
    message: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onSubmit() {
    const from = this.usersService.getUserEmail();
    const subject = this.form.value.subject;
    const body = this.form.value.message;
    const email: Email = { from: from(), subject: subject, body: body };
    this.emailService.sendEmail(email).subscribe({
      next: () => {
        this.form.reset();
        alert('Email sent successfully');
      },
      error: () => {
        alert('Error sending email');
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('support');
  }
}
