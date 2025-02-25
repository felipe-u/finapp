import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
  user = signal<any | undefined>(undefined);
  editMode = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.usersService.findById(params.userId).subscribe({
        next: (user) => {
          this.user.set(user);
          console.log(user);
        },
        error: (error: Error) => {
          console.error(error.message);
        }
      })
    })
  }
}
