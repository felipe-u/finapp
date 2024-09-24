import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInfoComponent } from './commercial-info.component';

describe('CommercialInfoComponent', () => {
  let component: CommercialInfoComponent;
  let fixture: ComponentFixture<CommercialInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommercialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
