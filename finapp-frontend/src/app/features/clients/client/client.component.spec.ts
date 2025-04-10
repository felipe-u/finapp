import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
