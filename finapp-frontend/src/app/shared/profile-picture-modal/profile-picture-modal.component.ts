import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ImagesService } from '../../core/services/images.service';
import { UsersService } from '../../core/services/users.service';
import { TranslatePipe } from '@ngx-translate/core';

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
            console.error(err.message);
          }
        })
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert('Please select a file');
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
          console.log('Profile image updated successfully');
          this.closeModal();
          this.exportNewImageUrl();
        },
        error: (err) => {
          console.error(err.message);
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
            console.log('Image deleted')
          },
          error: (err) => {
            console.error(err.message);
          }
        })
    }
  }

  deleteTmpImage() {
    if (this.imagesService.tempImageUrl) {
      this.imagesService.deleteTmpImage()?.subscribe({
        next: () => {
          console.log('Temp image deleted')
        },
        error: (err) => {
          console.error(err.message);
        }
      })
    }
  }

}
