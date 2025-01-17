import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { GeoInfo } from '../../../../core/models/geoInfo.model';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';

@Component({
  selector: 'app-geo-info',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker],
  templateUrl: './geo-info.component.html',
  styleUrl: './geo-info.component.css'
})
export class GeoInfoComponent {
  private clientsService = inject(ClientsService);
  client = signal<any | undefined>(undefined);
  geoInfo = signal<GeoInfo>(undefined);
  location = signal<any>(undefined);
  center = signal<google.maps.LatLngLiteral>({ lat: 10.9845951, lng: -74.8179751 });
  zoom = signal(12);
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
