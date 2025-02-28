import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    url = 'http://localhost:3000/';

    getAllUsers() {
        return this.httpClient.get<any>(this.url + 'users')
    }

    findById(userId: string) {
        return this.httpClient.get<any>(this.url + 'users/' + userId)
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
}