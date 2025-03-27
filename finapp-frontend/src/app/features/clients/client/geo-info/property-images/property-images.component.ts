import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { ImagesService } from '../../../../../core/services/images.service';

@Component({
  selector: 'app-property-images',
  standalone: true,
  imports: [],
  templateUrl: './property-images.component.html',
  styleUrl: './property-images.component.css'
})
export class PropertyImagesComponent implements OnChanges, AfterViewInit {
  private imagesService = inject(ImagesService);
  private renderer = inject(Renderer2);
  @Input() editMode: boolean;
  @Input() propertyImagesUrl: string[] = [];
  @ViewChild('fallback') fallbackElement!: ElementRef;
  propertyImagesUrlColumn1: string[] = [];
  propertyImagesUrlColumn2: string[] = [];
  tempPropertyImagesUrl: string[] = [];
  deletedPropertyImagesUrl: string[] = [];
  newPropertyImagesUrl: string[] = [];
  selectedFile: File | null = null;
  slideIndex = 1;

  ngAfterViewInit(): void {
    this.updateFallbackVisibility();

    if (!this.editMode) {
      this.showSlides(this.slideIndex);
    }
  }

  ngOnChanges(): void {
    if (this.editMode) {
      this.tempPropertyImagesUrl = [...this.propertyImagesUrl];
      this.fillColumns();
    } else {
      this.showSlides(this.slideIndex);
    }
  }

  plusSlides(n: number): void {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n: number): void {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n: number): void {
    let slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;

    if (slides.length === 0) {
      this.updateFallbackVisibility();
      return;
    }

    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
      this.renderer.setStyle(slides[i], 'display', 'none');
    }
    this.renderer.setStyle(slides[this.slideIndex - 1], 'display', 'block')
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.imagesService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.tempPropertyImagesUrl.push(response.imageUrl);
          this.newPropertyImagesUrl.push(response.imageUrl);
          this.fillColumns();
        },
        error: (err) => {
          console.error(err.message);
        }
      })
    }
  }

  onDeleteFile(imageUrl) {
    this.deletedPropertyImagesUrl.push(imageUrl);
    this.tempPropertyImagesUrl = this.tempPropertyImagesUrl.filter(url => url !== imageUrl);
    this.fillColumns();
    this.showSlides(this.slideIndex);
  }

  onUpdate() {
    if (this.deletedPropertyImagesUrl.length > 0) {
      this.imagesService.deleteImages(this.deletedPropertyImagesUrl).subscribe();
    }
    return this.tempPropertyImagesUrl;
  }

  onCancel() {
    this.tempPropertyImagesUrl = [...this.propertyImagesUrl];
    if (this.newPropertyImagesUrl.length > 0) {
      this.imagesService.deleteImages(this.newPropertyImagesUrl).subscribe();
    }
    this.resetArrays();
  }

  private fillColumns() {
    this.propertyImagesUrlColumn1 = [];
    this.propertyImagesUrlColumn2 = [];
    for (let i = 0; i < this.tempPropertyImagesUrl.length; i++) {
      if ((i % 2) === 0) {
        this.propertyImagesUrlColumn1.push(this.tempPropertyImagesUrl[i]);
      } else {
        this.propertyImagesUrlColumn2.push(this.tempPropertyImagesUrl[i]);
      }
    }
  }

  resetArrays() {
    this.tempPropertyImagesUrl = [];
    this.newPropertyImagesUrl = [];
    this.deletedPropertyImagesUrl = [];
  }

  private updateFallbackVisibility() {
    if (!this.fallbackElement?.nativeElement) return;
    const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
    this.fallbackElement.nativeElement.style.display = slides.length === 0 ? 'block' : 'none';
  }
}