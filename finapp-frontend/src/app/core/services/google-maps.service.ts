import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsServiceService {
    private isLoaded = false;
    private apiKey = environment.GOOGLE_MAPS_API_KEY;
    private loadPromise: Promise<void>;

    load(): Promise<void> {
        if (this.isLoaded) {
            return this.loadPromise;
        }
        this.loadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=marker`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                this.isLoaded = true;
                resolve()
            };

            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
        return this.loadPromise;
    }
}