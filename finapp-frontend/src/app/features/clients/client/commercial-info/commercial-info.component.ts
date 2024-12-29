import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { CommercialInfo } from '../../../../core/models/commercialInfo.model';
import { Reference } from '../../../../core/models/reference.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commercial-info',
  standalone: true,
  imports: [],
  templateUrl: './commercial-info.component.html',
  styleUrl: './commercial-info.component.css'
})
export class CommercialInfoComponent {
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  client = signal<any | undefined>(undefined);
  debtorName = signal<string | undefined>(undefined);
  coDebtorName = signal<string | undefined>(undefined);
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

    if (this.client().role === 'debtor') {
      this.clientsService.getCodebtorName().subscribe({
        next: (codebtorName) => {
          this.coDebtorName.set(codebtorName);
        },
        error: (error) => {
          console.error(error);
        }
      })
    } else if (this.client().role === 'codebtor') {
      this.clientsService.getDebtorName().subscribe({
        next: (debtorName) => {
          this.debtorName.set(debtorName);
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }

  changeEditMode() {
    this.editMode = !this.editMode
  }

  openCodebtorProfile() {
    this.clientsService.setDebtorId(this.client()._id);
    this.router.navigate(['/clients', this.client().codebtor]);
  }

  openDebtorProfile() {
    const debtorId = this.clientsService.getDebtorId();
    this.router.navigate(['/clients', debtorId()]);
  }
}
