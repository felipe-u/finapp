import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  
  @ViewChild('sidepanel', { static: false }) sidepanel: ElementRef;

  openSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 250px');
  }

  closeSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 0px');
  }

  onLogout() {
    this.authService.logout();
  }
}
