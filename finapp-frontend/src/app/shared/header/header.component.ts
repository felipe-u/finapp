import { Component, ElementRef, HostListener, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { ClientsService } from '../../core/services/clients.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  isSidePanelOpen = false;
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
    this.isSidePanelOpen = true;
  }

  closeSidePanel() {
    this.sidepanel.nativeElement.setAttribute('style', 'width: 0px');
    this.isSidePanelOpen = false;
  }

  goToProfile() {
    this.router.navigateByUrl(`account/${this.userId()}/profile`);
  }

  goToSettings() {
    this.router.navigateByUrl(`account/${this.userId()}/settings`);
  }

  onLogout() {
    this.usersService.cleanStorage();
    this.clientsService.cleanStorage();
    this.authService.logout();
  }

 @HostListener('document:click', ['$event'])
 onDocumentClick(event: MouseEvent) {
  const clickedInside = this.sidepanel.nativeElement.contains(event.target);
  if (!clickedInside && this.isSidePanelOpen) {
    this.closeSidePanel()
  }
 }
}