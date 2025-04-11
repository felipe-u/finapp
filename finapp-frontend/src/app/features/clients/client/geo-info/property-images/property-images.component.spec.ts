import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImagesComponent } from './property-images.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImagesService } from '../../../../../core/services/images.service';
import { of } from 'rxjs';

describe('PropertyImagesComponent', () => {
  let component: PropertyImagesComponent;
  let fixture: ComponentFixture<PropertyImagesComponent>;
  let imagesService: jasmine.SpyObj<ImagesService>;

  beforeEach(async () => {
    const imagesServiceSpy = jasmine.createSpyObj('ImagesService', ['uploadImage', 'deleteImages']);

    await TestBed.configureTestingModule({
      imports: [
        PropertyImagesComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ImagesService, useValue: imagesServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PropertyImagesComponent);
    component = fixture.componentInstance;
    imagesService = TestBed.inject(ImagesService) as jasmine.SpyObj<ImagesService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFileSelected', () => {
    it('should add uploaded image to temp and new arrays', () => {
      const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
      const event = {
        target: {
          files: [mockFile]
        }
      } as unknown as Event;

      const mockResponse = { imageUrl: 'http://fake-url.com/image.png' };
      imagesService.uploadImage.and.returnValue(of(mockResponse));

      component.onFileSelected(event);

      expect(imagesService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(component.tempPropertyImagesUrl).toContain(mockResponse.imageUrl);
      expect(component.newPropertyImagesUrl).toContain(mockResponse.imageUrl);
    });
  });

  describe('onDeleteFile', () => {
    it('should remove image from tempPropertyImagesUrl and add to deletedPropertyImagesUrl', () => {
      const url = 'http://example.com/image.jpg';
      component.tempPropertyImagesUrl = [url, 'http://another.com/img2.jpg'];
      component.deletedPropertyImagesUrl = [];

      component.onDeleteFile(url);

      expect(component.tempPropertyImagesUrl).not.toContain(url);
      expect(component.deletedPropertyImagesUrl).toContain(url);
    });
  });

  describe('onUpdate', () => {
    it('should call deleteImages if there are deleted images', () => {
      const deletedUrls = ['img1.png', 'img2.png'];
      component.deletedPropertyImagesUrl = [...deletedUrls];
      component.tempPropertyImagesUrl = ['img3.png'];

      imagesService.deleteImages.and.returnValue(of(true));

      const result = component.onUpdate();

      expect(imagesService.deleteImages).toHaveBeenCalledWith(deletedUrls);
      expect(result).toEqual(['img3.png']);
    });

    it('should not call deleteImages if deletedPropertyImagesUrl is empty', () => {
      component.deletedPropertyImagesUrl = [];
      component.tempPropertyImagesUrl = ['img3.png'];

      const result = component.onUpdate();

      expect(imagesService.deleteImages).not.toHaveBeenCalled();
      expect(result).toEqual(['img3.png']);
    });
  });
});
