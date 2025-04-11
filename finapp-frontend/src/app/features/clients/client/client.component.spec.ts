import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientsService } from '../../../core/services/clients.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;

  beforeEach(async () => {
    const mockClient = {
      _id: '123',
      name: 'Test Client',
      role: 'debtor',
      codebtor: 'codebtor-id'
    };

    clientsServiceSpy = jasmine.createSpyObj('ClientsService', [
      'findById',
      'setClient',
      'setCodebtorId',
      'setDebtorId'
    ]);
    clientsServiceSpy.findById.and.returnValue(of(mockClient));

    await TestBed.configureTestingModule({
      imports: [
        ClientComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ clientId: '123' })
          }
        },
        {
          provide: ClientsService, useValue: clientsServiceSpy
        }
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

  it('should load client and set signals on init', () => {
    expect(clientsServiceSpy.findById).toHaveBeenCalledWith('123');
    expect(clientsServiceSpy.setClient).toHaveBeenCalledWith(jasmine.objectContaining({ _id: '123' }));
    expect(clientsServiceSpy.setCodebtorId).toHaveBeenCalledWith('codebtor-id');
    expect(component.client()?.name).toBe('Test Client');
  });

  it('should clean up client data on destroy', () => {
    component.ngOnDestroy();
    expect(clientsServiceSpy.setClient).toHaveBeenCalledWith(undefined);
    expect(clientsServiceSpy.setCodebtorId).toHaveBeenCalledWith(undefined);
    expect(clientsServiceSpy.setDebtorId).toHaveBeenCalledWith(undefined);
  });
});
