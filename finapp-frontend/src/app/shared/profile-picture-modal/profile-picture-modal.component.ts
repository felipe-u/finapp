import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ImagesService } from '../../core/services/images.service';
import { UsersService } from '../../core/services/users.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotiflixService } from '../../core/services/notiflix.service';
import { LoggingService } from '../../core/services/logging.service';
import { LogMessages } from '../../core/utils/log-messages';

@Component({
  selector: 'app-profile-picture-modal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './profile-picture-modal.component.html',
  styleUrl: './profile-picture-modal.component.css'
})
export class ProfilePictureModalComponent {
  private imagesService = inject(ImagesService);
  private usersService = inject(UsersService);
  private notiflix = inject(NotiflixService);
  private translate = inject(TranslateService);
  private loggingService = inject(LoggingService);
  @Output() close = new EventEmitter<void>();
  @Output() newImageUrl = new EventEmitter<string>();
  @Input() model: string;
  @Input() modelId: string;
  @Input() actualImageUrl: string;
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.imagesService.uploadImage(this.selectedFile)
        .subscribe({
          next: (response) => {
            this.imageUrl = response.imageUrl;
          },
          error: (err) => {
            this.loggingService.error(err.message);
          }
        })
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      this.notiflix.showInfo(
        this.translate.instant('NOTIFLIX.SELECT_FILE')
      );
      return;
    }
    this.imagesService.updateImage(this.model, this.modelId)
      .subscribe({
        next: () => {
          if (this.actualImageUrl !== '') {
            this.deleteImage()
            if (this.model === 'user') {
              this.usersService.setUserPhoto(this.imagesService.tempImageUrl);
            }
          }
          this.closeModal();
          this.exportNewImageUrl();
        },
        error: (err) => {
          this.loggingService.error(err.message);
        }
      })
  }

  onCancel() {
    if (this.imageUrl) {
      this.deleteTmpImage();
    }
    this.closeModal();
  }

  closeModal() {
    this.close.emit();
  }

  exportNewImageUrl() {
    this.newImageUrl.emit(this.imageUrl);
  }

  deleteImage() {
    if (this.actualImageUrl !== '') {
      this.imagesService.deleteImage(this.actualImageUrl)
        .subscribe({
          next: () => {
            this.loggingService.log(LogMessages.IMG_DELETED);
          },
          error: (err) => {
            this.loggingService.error(err.message);
          }
        })
    }
  }

  deleteTmpImage() {
    if (this.imagesService.tempImageUrl) {
      this.imagesService.deleteTmpImage()?.subscribe({
        next: () => {
          this.loggingService.log(LogMessages.TMP_IMG_DELETED);
        },
        error: (err) => {
          this.loggingService.error(err.message);
        }
      })
    }
  }

}
