import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenComponent } from './forbidden.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ForbiddenComponent,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
