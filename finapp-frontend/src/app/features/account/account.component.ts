import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { UsersService } from '../../core/services/users.service';
import { FooterComponent } from "../../shared/footer/footer.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TranslatePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private translate = inject(TranslateService);
  userId = signal<string | null>(null);
  userName = signal<string | null>(null);
  userRole = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.usersService.getUserId();
    const userName = this.usersService.getUserName();
    const userRole = this.usersService.getUserRole();
    this.userId.set(userId());
    this.userName.set(userName());

    this.translate.get(`FIELDS.${userRole().toUpperCase()}`)
      .subscribe((translatedRole) => {
        this.userRole.set(translatedRole);
      })

    this.translate.onLangChange.subscribe(() => {
      this.translate.get(`FIELDS.${userRole().toUpperCase()}`)
        .subscribe((translatedRole) => {
          this.userRole.set(translatedRole);
        });
    });
  }

  goToProfile() {
    this.router.navigate(['account', this.userId(), 'profile']);
  }

  goToSettings() {
    this.router.navigate(['account', this.userId(), 'settings']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
