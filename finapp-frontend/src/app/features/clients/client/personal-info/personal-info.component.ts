import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { PersonalInfo } from '../../../../core/models/personalInfo.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagesService } from '../../../../core/services/images.service';
import { ProfilePictureModalComponent } from "../../../../shared/profile-picture-modal/profile-picture-modal.component";
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [ReactiveFormsModule, ProfilePictureModalComponent, DatePipe, TranslatePipe],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  personalInfo = signal<PersonalInfo>(undefined)
  editMode = false;
  isModalOpen = false;

  form = new FormGroup({
    idNumber: new FormControl('', {
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      validators: [Validators.required]
    }),
    birthDate: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientPersonalInfo().subscribe({
      next: (personalInfo) => {
        this.personalInfo.set(personalInfo);
        const birthDate = this.getDateWithoutTimezoneOffset(personalInfo.birthDate);
        this.personalInfo().birthDate = birthDate;
        console.log(personalInfo);
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });
  }

  prepopulateForm() {
    this.changeEditMode();
    this.form.patchValue({
      idNumber: this.client().identification.number,
      email: this.personalInfo().email,
      phone: this.personalInfo().phone,
      birthDate: new Date(this.personalInfo().birthDate).toISOString().split('T')[0]
    })
  }

  changeEditMode() {
    this.editMode = !this.editMode;
  }

  onSubmit() {
    if (confirm("Confirmar cambios")) {
      const newIdNumber = this.form.value.idNumber;
      const newEmail = this.form.value.email;
      const newPhone = this.form.value.phone;
      const newBirthDate = this.form.value.birthDate;
      const newBirthDateWithoutTimezoneOffset = this.getDateWithoutTimezoneOffset(newBirthDate);

      const newPersonalInfo = new PersonalInfo(
        this.personalInfo()._id,
        newEmail,
        newPhone,
        newBirthDateWithoutTimezoneOffset,
        this.personalInfo().photo
      );

      this.clientsService.editPersonalInfo(newPersonalInfo, newIdNumber).subscribe();
      this.personalInfo.set(newPersonalInfo);
      this.client().identification.number = newIdNumber;
      this.changeEditMode();
    }
  }

  openProfilePictureModal() {
    this.isModalOpen = true;
  }

  closeProfilePictureModal() {
    this.isModalOpen = false;
  }

  updateClientPhoto(newImageUrl: string) {
    this.personalInfo().photo = newImageUrl;
  }

  getDateWithoutTimezoneOffset(incomingDate: string) {
    var date = new Date(incomingDate);
    var dateWithoutTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + dateWithoutTimezoneOffset)
  }
}