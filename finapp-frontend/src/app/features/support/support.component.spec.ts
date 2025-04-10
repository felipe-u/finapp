import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportComponent } from './support.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SupportComponent', () => {
  let component: SupportComponent;
  let fixture: ComponentFixture<SupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SupportComponent,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
