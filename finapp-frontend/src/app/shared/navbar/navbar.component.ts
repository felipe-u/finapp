import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private usersService = inject(UsersService);
  userRole = signal<string | null>(null);

  ngOnInit(): void {
    const userRole = this.usersService.getUserRole()
    this.userRole.set(userRole());
    console.log(this.userRole());
  }
}
