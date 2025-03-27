import { Component, inject, signal, ViewChild } from '@angular/core';
import { ClientsService } from '../../../../core/services/clients.service';
import { GeoInfo } from '../../../../core/models/geoInfo.model';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../../core/services/location.service';
import { PropertyImagesComponent } from "./property-images/property-images.component";

@Component({
  selector: 'app-geo-info',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, ReactiveFormsModule, PropertyImagesComponent],
  templateUrl: './geo-info.component.html',
  styleUrl: './geo-info.component.css'
})
export class GeoInfoComponent {
  private clientsService = inject(ClientsService);
  private locationService = inject(LocationService);
  @ViewChild(PropertyImagesComponent) propertyImagesComponent!: PropertyImagesComponent;
  client = signal<any | undefined>(undefined);
  geoInfo = signal<GeoInfo>(undefined);
  center = signal<google.maps.LatLngLiteral>({ lat: 10.9845951, lng: -74.8179751 });
  zoom = signal(12);
  advancedMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = { gmpDraggable: true };
  editMode = false;
  departments;
  cities;
  selectedDeparment = signal<string>('');

  ngOnInit(): void {
    this.client = this.clientsService.getClient();
    this.clientsService.getClientGeographicInfo().subscribe({
      next: (geoInfo) => {
        this.geoInfo.set(geoInfo);
        this.center.set({ lat: geoInfo.latitude, lng: geoInfo.longitude })
        console.log(geoInfo)
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    });

    this.locationService.getDepartmentsAndCities().subscribe({
      next: (data) => {
        this.departments = data;
        console.log(data)
      },
      error: (error: Error) => {
        console.error(error.message);
      }
    })

    this.form.get('department')?.valueChanges.subscribe(selectedDepartment => {
      const selected = this.departments.find(d => d.departamento === selectedDepartment);
      this.cities = selected ? selected.ciudades : [];
      if (selectedDepartment !== this.geoInfo().department) {
        this.form.patchValue({ city: '' });
      }
    })
  }

  form = new FormGroup({
    latitude: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)]
    }),
    longitude: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)]
    }),
    address: new FormControl('', {
      validators: [Validators.required]
    }),
    city: new FormControl('', {
      validators: [Validators.required]
    }),
    department: new FormControl('', {
      validators: [Validators.required]
    }),
    neighbourhood: new FormControl('', {
      validators: [Validators.required]
    }),
    sector: new FormControl(''),
    additionalInfo: new FormControl(''),
  })

  prepolutaForm() {
    this.changeEditMode();
    this.form.patchValue({
      latitude: this.geoInfo().latitude,
      longitude: this.geoInfo().longitude,
      address: this.geoInfo().address,
      city: this.geoInfo().city,
      department: this.geoInfo().department,
      neighbourhood: this.geoInfo().neighbourhood,
      sector: this.geoInfo().sector,
      additionalInfo: this.geoInfo().additionalInfo
    })
  }

  updateLocation(event: google.maps.MapMouseEvent) {
    this.form.patchValue({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng()
    })
  }

  onSubmit() {
    if (this.form.valid) {
      if (confirm("Confirmar cambios")) {
        const newAddress = this.form.value.address;
        const newCity = this.form.value.city;
        const newDepartment = this.form.value.department;
        const newNeighbourhood = this.form.value.neighbourhood;
        const newLatitude = this.form.value.latitude;
        const newLongitude = this.form.value.longitude;
        const newGoogleMapsUrl = '';
        const newPropertyImages = this.propertyImagesComponent.onUpdate();
        const newSector = this.form.value.sector;
        const newAdditionalInfo = this.form.value.additionalInfo;

        const newGeoInfo = new GeoInfo(
          this.geoInfo()._id,
          newAddress,
          newCity,
          newDepartment,
          newNeighbourhood,
          newLatitude,
          newLongitude,
          newGoogleMapsUrl,
          newPropertyImages,
          newSector,
          newAdditionalInfo
        );

        this.clientsService.editGeoInfo(newGeoInfo).subscribe();
        this.geoInfo.set(newGeoInfo);
        this.changeEditMode();
        this.propertyImagesComponent.resetArrays();
      }
    }
  }

  cancel() {
    this.propertyImagesComponent.onCancel();
    this.changeEditMode();
  }

  changeEditMode() {
    this.editMode = !this.editMode;
  }
}
