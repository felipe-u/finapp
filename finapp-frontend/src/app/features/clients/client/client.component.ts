import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientNavbarComponent } from "./client-navbar/client-navbar.component";


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, ClientNavbarComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent{


}
