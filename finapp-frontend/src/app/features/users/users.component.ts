import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoggingService } from '../../core/services/logging.service';
import { LogMessages } from '../../core/utils/log-messages';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private loggingService = inject(LoggingService);
  searchTerm = '';
  managers = signal<any>([]);
  assistants = signal<any>([]);
  managerBtnSelected = signal(false);
  assistantBtnSelected = signal(false);

  ngOnInit() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.managers.set(users.managers);
        this.assistants.set(users.assistants);
      },
      error: (error: Error) => {
        this.loggingService.error(error.message);
      }
    });
  }

  filterByManagers() {
    this.managerBtnSelected.set(
      !this.managerBtnSelected()
    );
  }

  filterByAssistants() {
    this.assistantBtnSelected.set(
      !this.assistantBtnSelected()
    );
  }

  filteredUsers = computed(() => {
    const managers = this.managerBtnSelected() ? this.managers() : [];
    const assistants = this.assistantBtnSelected() ? this.assistants() : [];
    return managers.length || assistants.length
      ? [...managers, ...assistants]
      : [...this.managers(), ...this.assistants()];
  })


  openUserProfile(userId: string) {
    this.router.navigate(['users', userId]);
  }

  searchUser() {
    const hasLetters = /[a-zA-Z]/.test(this.searchTerm);
    const searchTerm = this.searchTerm;
    if (searchTerm !== '' && hasLetters) {
      this.managerBtnSelected.set(false);
      this.assistantBtnSelected.set(false);
      this.usersService.getUsersBySearchTerm(searchTerm)
        .subscribe({
          next: (users) => {
            this.managers.set(users.managers);
            this.assistants.set(users.assistants);
          },
          error: (error: Error) => {
            this.loggingService.error(error.message);
          }
        });
    } else {
      this.loggingService.log(LogMessages.INVALID_SEARCH);
    }
  }
}