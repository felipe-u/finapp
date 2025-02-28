import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  searchTerm = '';
  managers = signal<any>([]);
  assistants = signal<any>([]);

  ngOnInit() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.managers.set(users.managers);
        this.assistants.set(users.assistants);
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
  }

  openUserProfile(userId: string) {
    this.router.navigate(['users', userId]);
  }

  searchUser() {
    const searchTerm = this.searchTerm;
    if (searchTerm !== '') {
      this.usersService.getUsersBySearchTerm(searchTerm).subscribe({
        next: (users) => {
          this.managers.set(users.managers);
          this.assistants.set(users.assistants);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      });
    }
  }
}
