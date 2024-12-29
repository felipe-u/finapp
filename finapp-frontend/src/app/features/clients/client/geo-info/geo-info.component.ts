import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { GeoInfo } from '../../../../core/models/geoInfo.model';

@Component({
  selector: 'app-geo-info',
  standalone: true,
  imports: [],
  templateUrl: './geo-info.component.html',
  styleUrl: './geo-info.component.css'
})
export class GeoInfoComponent {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  geoInfo = signal<GeoInfo>(undefined);
  editMode = false;

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientGeographicInfo().subscribe({
      next: (geoInfo) => {
        this.geoInfo.set(geoInfo);
        console.log(geoInfo)
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
