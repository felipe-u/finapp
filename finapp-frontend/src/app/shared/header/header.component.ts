import { Component, ElementRef, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  userName = signal<string | null>(null);
  userId = signal<string | null>(null);
  userPhoto = signal<string | null>(null);

  @ViewChild('sidepanel', { static: false }) sidepanel: ElementRef;
  @Input() isInAccountSettings: boolean;

  ngOnInit(): void {
    const userId = this.usersService.getUserId();
    const userName = this.usersService.getUserName();
    const userPhoto = this.usersService.getUserPhoto();
    this.userId.set(userId());
    this.userName.set(userName());
    this.userPhoto.set(userPhoto());
  }

  openSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 250px');
  }

  closeSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 0px');
  }

  goToProfile() {
    this.router.navigateByUrl(`account/${this.userId()}/profile`);
  }

  goToSettings() {
    this.router.navigateByUrl(`account/${this.userId()}/settings`);
  }

  onLogout() {
    this.authService.logout();
  }

  private onDocumentClick(event: MouseEvent) {
    if (this.sidepanel && !this.sidepanel.nativeElement.contains(event.target)) {
      this.closeSidePanel();
    }
  }
}
