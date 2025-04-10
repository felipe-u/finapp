import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: ""
})
class HeaderStubComponent {
  @Input() isInAccountSettings: boolean;
}

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountComponent,
        HeaderStubComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
      ],
      providers: [
        provideRouter([]),
        {
          provide: UsersService,
          useValue: {
            getUserId: () => () => "123",
            getUserName: () => () => "John Doe",
            getUserRole: () => () => "admin",
            getUserPhoto: () => () => ""
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
