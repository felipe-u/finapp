import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    private translate = inject(TranslateService);
    private userId = signal<string | null>(null);
    private userName = signal<string | null>(null);
    private userRole = signal<string | null>(null);
    private userEmail = signal<string | null>(null);
    private userPhoto = signal<string | null>(null);
    private userLang = signal<string | null>(null);
    url = 'http://localhost:3000/';

    constructor() {
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserEmail = localStorage.getItem('userEmail');
        const storedUserPhoto = localStorage.getItem('userPhoto');
        const storedLang = localStorage.getItem('lang');

        if (storedUserId) this.userId.set(storedUserId);
        if (storedUserName) this.userName.set(storedUserName);
        if (storedUserRole) this.userRole.set(storedUserRole);
        if (storedUserEmail) this.userEmail.set(storedUserEmail);
        if (storedUserPhoto) this.userPhoto.set(storedUserPhoto);
        if (storedLang) {
            this.userLang.set(storedLang);
            this.translate.use(storedLang);
        }
    }

    getUserId() {
        return this.userId;
    }

    setUserId(userId: string) {
        this.userId.set(userId);
        localStorage.setItem('userId', userId);
    }

    getUserName() {
        return this.userName;
    }

    setUserName(userName: string) {
        this.userName.set(userName);
        localStorage.setItem('userName', userName);
    }

    getUserRole() {
        return this.userRole;
    }

    setUserRole(userRole: string) {
        this.userRole.set(userRole);
        localStorage.setItem('userRole', userRole);
    }

    getUserEmail() {
        return this.userEmail;
    }

    setUserEmail(userEmail: string) {
        this.userEmail.set(userEmail);
        localStorage.setItem('userEmail', userEmail);
    }

    getUserPhoto() {
        return this.userPhoto;
    }

    setUserPhoto(userPhoto: string) {
        this.userPhoto.set(userPhoto);
        localStorage.setItem('userPhoto', userPhoto);
    }

    getUserLang() {
        return this.userLang;
    }

    setUserLang(userLang: string) {
        this.userLang.set(userLang);
        localStorage.setItem('lang', userLang);
        this.translate.use(userLang);
    }

    cleanStorage() {
        this.userId.set(null);
        this.userName.set(null);
        this.userRole.set(null);
        this.userEmail.set(null);
        this.userPhoto.set(null);
        this.userLang.set(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoto');
        localStorage.removeItem('lang');
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

    changeUserLang(userId: string, newLang: string) {
        console.log("userId: " + userId);
        return this.httpClient.post<any>(this.url + 'change-lang', { userId, newLang })
    }
}