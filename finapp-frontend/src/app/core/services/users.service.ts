import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    url = 'http://localhost:3000/';

    getAllUsers() {
        return this.httpClient.get<any>(this.url + 'users/all')
    }

    findById(userId: string) {
        const params = new HttpParams().set('userId', userId);
        return this.httpClient.get<any>(this.url + 'users/', { params: params})
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
}