import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    private userId = signal<string | null>(null);
    private userName = signal<string | null>(null);
    private userRole = signal<string | null>(null);
    private userEmail = signal<string | null>(null);
    private userPhoto = signal<string | null>(null);
    url = 'http://localhost:3000/';

    getUserId() {
        return this.userId;
    }

    setUserId(userId: string) {
        this.userId.set(userId);
    }

    getUserName() {
        return this.userName;
    }

    setUserName(userName: string) {
        this.userName.set(userName);
    }

    getUserRole() {
        return this.userRole;
    }

    setUserRole(userRole: string) {
        this.userRole.set(userRole);
    }

    getUserEmail() {
        return this.userEmail;
    }

    setUserEmail(userEmail: string) {
        this.userEmail.set(userEmail);
    }

    getUserPhoto() {
        return this.userPhoto;
    }

    setUserPhoto(userPhoto: string) {
        this.userPhoto.set(userPhoto);
    }

    getAllUsers() {
        return this.httpClient.get<any>(this.url + 'users/all')
    }

    findById(userId: string) {
        const params = new HttpParams().set('userId', userId);
        return this.httpClient.get<any>(this.url + 'users/', { params: params })
            .pipe(
                map((resData) => resData.user)
            )
    }

    updateUserInfo(userId: string, newEmail: string, newPhone: string) {
        return this.httpClient.put<any>(
            this.url + 'user-update',
            { userId: userId, email: newEmail, phone: newPhone }
        )
    }

    getUsersBySearchTerm(searchTerm: string) {
        const params = new HttpParams().set('searchTerm', searchTerm);
        return this.httpClient.get<any>(this.url + 'users/all', { params: params }
        )
    }

    checkUserPassword(userId: string, oldPassword: string) {
        return this.httpClient.post<any>(this.url + 'check-password',
            { userId, oldPassword })
    }

    changePassword(userId: string, newPassword: string) {
        return this.httpClient.post<any>(this.url + 'change-password',
            { userId, newPassword })
    }
}