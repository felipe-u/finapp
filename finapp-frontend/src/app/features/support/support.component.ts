import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  private router = inject(Router);
  private CONFLUENCE_URL = environment.CONFLUENCE_URL;

  goToConfluence() {
    window.open(this.CONFLUENCE_URL, '_blank');
  }

  contactSupport() {
    this.router.navigateByUrl('support/contact');
  }
}
