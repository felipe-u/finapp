import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  private router = inject(Router);
  private CONFLUENCE_URL = 'https://www.google.com/';

  goToConfluence() {
    window.open(this.CONFLUENCE_URL, '_blank');
  }

  contactSupport() {
    this.router.navigateByUrl('support/contact');
  }
}
