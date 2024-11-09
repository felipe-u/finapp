import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './client-navbar.component.html',
  styleUrl: './client-navbar.component.css'
})
export class ClientNavbarComponent {

}
