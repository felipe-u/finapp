import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoInfoComponent } from './geo-info.component';

describe('GeoInfoComponent', () => {
  let component: GeoInfoComponent;
  let fixture: ComponentFixture<GeoInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
