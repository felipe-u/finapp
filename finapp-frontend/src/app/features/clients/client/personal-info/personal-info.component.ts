import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { PersonalInfo } from '../../../../core/models/personalInfo.model';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  personalInfo = signal<PersonalInfo>(undefined)
  editMode = false;

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientPersonalInfo().subscribe({
      next: (personalInfo) => {
        this.personalInfo.set(personalInfo);
        console.log(personalInfo)
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
  }

  changeEditMode() {
    this.editMode = !this.editMode
  }

}
