import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImagesService {
    private httpClient = inject(HttpClient);
    private API_URL = 'http://localhost:3000';
    tempImageUrl: string | null = null;

    uploadImage(image: File) {
        const formData = new FormData();
        formData.append('image', image);
        console.log('Uploading image...');
        return this.httpClient.post<{ imageUrl: string }>(`${this.API_URL}/upload`, formData).pipe(
            tap((response) => {
                this.tempImageUrl = response.imageUrl;
            })
        );
    }

    updateClientImage(personalInfoId: string) {
        if (!this.tempImageUrl) {
            console.error('No image to upload');
            return;
        };
        return this.httpClient.put(`${this.API_URL}/imgs/clients`, { personalInfoId: personalInfoId, imageUrl: this.tempImageUrl })
    }

    deleteImage(imageUrl: string) {
        return this.httpClient.delete(`${this.API_URL}/delete-image?imageUrl=${encodeURIComponent(imageUrl)}`);
    }

    deleteTmpImage() {
        if (!this.tempImageUrl) return;
        return this.httpClient.delete(`${this.API_URL}/delete-image?imageUrl=${encodeURIComponent(this.tempImageUrl)}`);
    }

}