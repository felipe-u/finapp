import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const mockUsers = {
    managers: [{ _id: '1', name: 'Alice', role: 'manager' }],
    assistants: [{ _id: '2', name: 'Bob', role: 'assistant' }]
  };

  const usersServiceStub = {
    getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of(mockUsers)),
    getUsersBySearchTerm: jasmine.createSpy('getUsersBySearchTerm').and.returnValue(of(mockUsers))
  };

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: UsersService, useValue: usersServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    usersServiceStub.getAllUsers.calls.reset();
    usersServiceStub.getUsersBySearchTerm.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle manager filter', () => {
    const initial = component.managerBtnSelected();
    component.filterByManagers();
    expect(component.managerBtnSelected()).toBe(!initial);
  });

  it('should toggle assistant filter', () => {
    const initial = component.assistantBtnSelected();
    component.filterByAssistants();
    expect(component.assistantBtnSelected()).toBe(!initial);
  });

  it('should return all users when no filter is active', () => {
    component.managerBtnSelected.set(false);
    component.assistantBtnSelected.set(false);
    const filtered = component.filteredUsers();
    expect(filtered.length).toBe(2);
  });

  it('should return only managers when manager filter is active', () => {
    component.managerBtnSelected.set(true);
    component.assistantBtnSelected.set(false);
    const filtered = component.filteredUsers();
    expect(filtered).toEqual(mockUsers.managers);
  });

  it('should return only assistants when assistant filter is active', () => {
    component.managerBtnSelected.set(false);
    component.assistantBtnSelected.set(true);
    const filtered = component.filteredUsers();
    expect(filtered).toEqual(mockUsers.assistants);
  });

  it('should navigate to user profile on openUserProfile()', () => {
    component.openUserProfile('123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['users', '123']);
  });

  it('should perform a search if term is valid', () => {
    component.searchTerm = 'alice';
    component.searchUser();
    expect(usersServiceStub.getUsersBySearchTerm).toHaveBeenCalledWith('alice');
    expect(component.managerBtnSelected()).toBeFalse();
    expect(component.assistantBtnSelected()).toBeFalse();
  });

  it('should not search if searchTerm is invalid', () => {
    component.searchTerm = '123'; // No letras
    component.searchUser();
    expect(usersServiceStub.getUsersBySearchTerm).not.toHaveBeenCalled();
  });
});