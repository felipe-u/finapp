import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private httpClient = inject(HttpClient);
    private router = inject(Router);
    private token = signal<string | null>(localStorage.getItem('ACCESS_TOKEN'));
    private tokenExpirationTimer: any;
    SERVER_URL: string = 'http:localhost:3000';

    isAuthenticated = computed(() => {
        const token = this.token();
        if (!token) return false;

        const expiration = new Date(localStorage.getItem('EXPIRES_IN') || '');
        return expiration > new Date();
    })

    register(user: User) {
        return this.httpClient.post(
            `${this.SERVER_URL}/auth/register`, user)
            .pipe(
                tap((res: any) => {
                    if (res?.token) {
                        this.saveToken(res.token, res.expiresIn);
                    }
                })
            )
    }

    login(email: string, password: string) {
        return this.httpClient.post(
            `${this.SERVER_URL}/auth/login`, { email, password })
            .pipe(
                tap((res: any) => {
                    if (res?.token) {
                        this.saveToken(res.token, res.expiresIn)
                    }
                })
            )
    }

    logout() {
        this.router.navigateByUrl('/auth/login');
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('EXPIRES_IN');
        this.token.set(null);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    private saveToken(token: string, expiresIn: number) {
        const expirationDate = new Date(Date.now() + expiresIn * 1000);
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('EXPIRES_IN', expirationDate.toISOString());
        this.token.set(token);
        this.autoLogout(expiresIn * 1000);

    }

    private autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}