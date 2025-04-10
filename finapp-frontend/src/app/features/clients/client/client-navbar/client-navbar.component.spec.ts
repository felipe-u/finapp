import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNavbarComponent } from './client-navbar.component';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('ClientNavbarComponent', () => {
  let component: ClientNavbarComponent;
  let fixture: ComponentFixture<ClientNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientNavbarComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
