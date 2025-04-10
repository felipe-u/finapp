import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordModalComponent } from './password-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('PasswordModalComponent', () => {
  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PasswordModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
