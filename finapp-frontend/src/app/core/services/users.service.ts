import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    url = 'http://localhost:3000/';

    getAllUsers() {
        return this.httpClient.get<any>(this.url + 'users')
    }
}