import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggingService } from './logging.service';
import { LogMessages } from '../utils/log-messages';

@Injectable({ providedIn: 'root' })
export class ImagesService {
    private httpClient = inject(HttpClient);
    private SERVER_URL = environment.SERVER_URL;
    private loggingService = inject(LoggingService);
    tempImageUrl: string | null = null;

    uploadImage(image: File) {
        const formData = new FormData();
        formData.append('image', image);
        return this.httpClient.post<{ imageUrl: string }>(
            `${this.SERVER_URL}/upload`, formData
        ).pipe(
            tap((response) => {
                this.tempImageUrl = response.imageUrl;
            })
        );
    }

    updateImage(model: string, modelId: string) {
        if (!this.tempImageUrl) {
            this.loggingService.error(LogMessages.NO_IMG_TO_UPLOAD);
            return;
        }
        return this.httpClient.put(
            `${this.SERVER_URL}/imgs/${model}`,
            { modelId: modelId, imageUrl: this.tempImageUrl }
        );
    }

    deleteImage(imageUrl: string) {
        return this.httpClient.delete(
            `${this.SERVER_URL}/delete-image?imageUrl=${encodeURIComponent(imageUrl)}`
        );
    }

    deleteTmpImage() {
        if (!this.tempImageUrl) return;
        return this.httpClient.delete(
            `${this.SERVER_URL}/delete-image?imageUrl=${encodeURIComponent(this.tempImageUrl)}`
        );
    }

    deleteImages(images: string[]) {
        return this.httpClient.post(
            `${this.SERVER_URL}/delete-images`, { images }
        ).pipe(
            tap(() => {
                if (this.tempImageUrl && images.includes(this.tempImageUrl)) {
                    this.tempImageUrl = null;
                }
            })
        );
    }
}