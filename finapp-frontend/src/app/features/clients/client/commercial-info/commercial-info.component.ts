import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { CommercialInfo } from '../../../../core/models/commercialInfo.model';
import { Reference } from '../../../../core/models/reference.model';

@Component({
  selector: 'app-commercial-info',
  standalone: true,
  imports: [],
  templateUrl: './commercial-info.component.html',
  styleUrl: './commercial-info.component.css'
})
export class CommercialInfoComponent {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  commercialInfo = signal<CommercialInfo>(undefined);
  famReferences = signal<[Reference]>(undefined);
  perReferences = signal<[Reference]>(undefined);
  comReferences = signal<[Reference]>(undefined);
  editMode = false;

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientCommercialInfo().subscribe({
      next: (commercialInfo) => {
        this.commercialInfo.set(commercialInfo);
        this.famReferences.set(commercialInfo.references.filter((reference) => reference.referenceType === 'FAM'));
        this.perReferences.set(commercialInfo.references.filter((reference) => reference.referenceType === 'PER'));
        this.comReferences.set(commercialInfo.references.filter((reference) => reference.referenceType === 'COM'));
        console.log(commercialInfo);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  changeEditMode() {
    this.editMode = !this.editMode
  }
}
