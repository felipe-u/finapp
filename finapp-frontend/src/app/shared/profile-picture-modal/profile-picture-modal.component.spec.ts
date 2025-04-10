import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureModalComponent } from './profile-picture-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ProfilePictureModalComponent', () => {
  let component: ProfilePictureModalComponent;
  let fixture: ComponentFixture<ProfilePictureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfilePictureModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfilePictureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
