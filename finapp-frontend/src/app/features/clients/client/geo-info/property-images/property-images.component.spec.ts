import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImagesComponent } from './property-images.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PropertyImagesComponent', () => {
  let component: PropertyImagesComponent;
  let fixture: ComponentFixture<PropertyImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PropertyImagesComponent,
        HttpClientTestingModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PropertyImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
