import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Notiflix from 'notiflix';

@Injectable({ providedIn: 'root' })
export class NotiflixService {
    private translate = inject(TranslateService);
    constructor() {
        this.configureNotiflix();
    }

    private configureNotiflix() {
        Notiflix.Confirm.init({
            titleColor: "#601a15",
            okButtonBackground: "#601a15",
        })

        Notiflix.Notify.init({
            success: { background: "#1c7a2d" },
            failure: { background: "#bf3429" },
            position: 'center-top',
            timeout: 2000
        })
    }

    showConfirm(
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel: () => void
    ) {
        Notiflix.Confirm.show(title, message, this.translate.instant('FIELDS.YES'), 'No', onConfirm, onCancel);
    }

    showSuccess(message: string) {
        Notiflix.Notify.success(message);
    }

    showError(message: string) {
        Notiflix.Notify.failure(message);
    }

    showInfo(message: string) {
        Notiflix.Notify.info(message);
    }
}