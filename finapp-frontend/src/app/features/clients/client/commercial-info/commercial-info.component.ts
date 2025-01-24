import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { CommercialInfo } from '../../../../core/models/commercialInfo.model';
import { Reference } from '../../../../core/models/reference.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferenceTypeEnum, RelationshipTypeEnum } from '../../../../core/models/enums';

@Component({
  selector: 'app-commercial-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './commercial-info.component.html',
  styleUrl: './commercial-info.component.css'
})
export class CommercialInfoComponent {
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  private referenceTypeEnum = ReferenceTypeEnum;
  private relationshipTypeEnum = RelationshipTypeEnum;
  client = signal<any | undefined>(undefined);
  debtorName = signal<string | undefined>(undefined);
  coDebtorName = signal<string | undefined>(undefined);
  commercialInfo = signal<CommercialInfo>(undefined);
  famReferences = signal<Reference[]>(undefined);
  perReferences = signal<Reference[]>(undefined);
  comReferences = signal<Reference[]>(undefined);
  editMode = false;

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientCommercialInfo().subscribe({
      next: (commercialInfo) => {
        this.commercialInfo.set(commercialInfo.commercialInfo);
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

  form = new FormGroup({
    commercialInfo: new FormGroup({
      jobOccupation: new FormControl('', {
        validators: [Validators.required]
      }),
      company: new FormControl('', {
        validators: [Validators.required]
      }),
      laborSenority: new FormControl(0, {
        validators: [Validators.required]
      }),
      income: new FormControl(0, {
        validators: [Validators.required, Validators.min(0)]
      }),
      additionalIncome: new FormControl(0, {
        validators: [Validators.required]
      }),
      expenses: new FormControl(0, {
        validators: [Validators.required, Validators.min(0)]
      })
    }),
    references: new FormGroup({
      famRef1: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      famRef2: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      perRef1: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      perRef2: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      comRef1: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      }),
      comRef2: new FormGroup({
        name: new FormControl('', {
          validators: [Validators.required]
        }),
        phone: new FormControl('', {
          validators: [Validators.required]
        }),
        relationship: new FormControl('', {
          validators: [Validators.required]
        })
      })
    })
  })

  prepopulateForm() {
    this.changeEditMode();
    console.log(this.famReferences());
    const actualLaborSenority = this.extractYearValue(this.commercialInfo().laborSenority);

    this.form.patchValue({
      commercialInfo: {
        jobOccupation: this.commercialInfo().jobOccupation,
        company: this.commercialInfo().company,
        laborSenority: actualLaborSenority,
        income: +this.commercialInfo().income,
        additionalIncome: +this.commercialInfo().additionalIncome,
        expenses: +this.commercialInfo().expenses
      },
      references: {
        famRef1: {
          name: this.famReferences().at(0).name,
          phone: this.famReferences().at(0).phone,
          relationship: this.famReferences().at(0).relationship
        },
        famRef2: {
          name: this.famReferences().at(1).name,
          phone: this.famReferences().at(1).phone,
          relationship: this.famReferences().at(1).relationship
        },
        perRef1: {
          name: this.perReferences().at(0).name,
          phone: this.perReferences().at(0).phone,
          relationship: this.perReferences().at(0).relationship
        },
        perRef2: {
          name: this.perReferences().at(1).name,
          phone: this.perReferences().at(1).phone,
          relationship: this.perReferences().at(1).relationship
        },
        comRef1: {
          name: this.comReferences().at(0).name,
          phone: this.comReferences().at(0).phone,
          relationship: this.comReferences().at(0).relationship
        },
        comRef2: {
          name: this.comReferences().at(1).name,
          phone: this.comReferences().at(1).phone,
          relationship: this.comReferences().at(1).relationship
        }
      }
    })
  }

  onSubmit() {
    if (confirm("Confirmar cambios")) {
      const newJobOccupation = this.form.value.commercialInfo.jobOccupation;
      const newCompany = this.form.value.commercialInfo.company;
      const newLaborSenority = this.buildJobOccupation(this.form.value.commercialInfo.laborSenority);
      const newIncome = this.form.value.commercialInfo.income;
      const newAdditionalIncome = this.form.value.commercialInfo.additionalIncome;
      const newExpenses = this.form.value.commercialInfo.expenses;

      const newCommercialInfo = new CommercialInfo(
        this.commercialInfo()._id,
        newJobOccupation,
        newCompany,
        newLaborSenority,
        newIncome,
        newAdditionalIncome,
        newExpenses
      );

      const newFamRef1 = new Reference(
        this.famReferences().at(0)._id,
        this.form.value.references.famRef1.name,
        null,
        'FAM' as ReferenceTypeEnum,
        this.form.value.references.famRef1.phone,
        this.form.value.references.famRef1.relationship as RelationshipTypeEnum
      );

      const newFamRef2 = new Reference(
        this.famReferences().at(1)._id,
        this.form.value.references.famRef2.name,
        null,
        'FAM' as ReferenceTypeEnum,
        this.form.value.references.famRef2.phone,
        this.form.value.references.famRef2.relationship as RelationshipTypeEnum
      );

      const newPerRef1 = new Reference(
        this.perReferences().at(0)._id,
        this.form.value.references.perRef1.name,
        null,
        'PER' as ReferenceTypeEnum,
        this.form.value.references.perRef1.phone,
        this.form.value.references.perRef1.relationship as RelationshipTypeEnum
      );

      const newPerRef2 = new Reference(
        this.perReferences().at(1)._id,
        this.form.value.references.perRef2.name,
        null,
        'PER' as ReferenceTypeEnum,
        this.form.value.references.perRef2.phone,
        this.form.value.references.perRef2.relationship as RelationshipTypeEnum
      );

      const newComRef1 = new Reference(
        this.comReferences().at(0)._id,
        this.form.value.references.comRef1.name,
        null,
        'COM' as ReferenceTypeEnum,
        this.form.value.references.comRef1.phone,
        this.form.value.references.comRef1.relationship as RelationshipTypeEnum
      );

      const newComRef2 = new Reference(
        this.comReferences().at(1)._id,
        this.form.value.references.comRef2.name,
        null,
        'COM' as ReferenceTypeEnum,
        this.form.value.references.comRef2.phone,
        this.form.value.references.comRef2.relationship as RelationshipTypeEnum
      );

      const newReferences = [newFamRef1, newFamRef2, newPerRef1, newPerRef2, newComRef1, newComRef2];
      this.clientsService.editCommercialInfo(newCommercialInfo, newReferences).subscribe();
      this.commercialInfo.set(newCommercialInfo);
      this.famReferences.set([newFamRef1, newFamRef2]);
      this.perReferences.set([newPerRef1, newPerRef2]);
      this.comReferences.set([newComRef1, newComRef2]);
      this.changeEditMode();
    }
  }

  changeEditMode() {
    this.editMode = !this.editMode
  }

  extractYearValue(input: string) {
    const array = input.split('');
    return Number(array[0]);
  }

  extractRelationshipEnum(input: string) {
    const relationshipEnum = this.relationshipTypeEnum[input];
    if (!relationshipEnum) {
      throw new Error(`Unknown relationship type: ${input}`);
    }
    return relationshipEnum;
  }

  buildJobOccupation(input: number): string {
    if (input === 1) {
      return input + ' año';
    }
    return input + ' años';
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
