import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.css'
})
export class AccountLayoutComponent { }