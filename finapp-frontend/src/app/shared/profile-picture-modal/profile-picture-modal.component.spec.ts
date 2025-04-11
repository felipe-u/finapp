import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePictureModalComponent } from './profile-picture-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ImagesService } from '../../core/services/images.service';
import { UsersService } from '../../core/services/users.service';
import { NotiflixService } from '../../core/services/notiflix.service';

describe('ProfilePictureModalComponent', () => {
  let component: ProfilePictureModalComponent;
  let fixture: ComponentFixture<ProfilePictureModalComponent>;
  let imagesServiceSpy: jasmine.SpyObj<ImagesService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let notiflixSpy: jasmine.SpyObj<NotiflixService>;

  beforeEach(async () => {
    imagesServiceSpy = jasmine.createSpyObj('ImagesService', [
      'uploadImage',
      'updateImage',
      'deleteImage',
      'deleteTmpImage'
    ]);
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['setUserPhoto']);
    notiflixSpy = jasmine.createSpyObj('NotiflixService', ['showInfo']);

    await TestBed.configureTestingModule({
      imports: [
        ProfilePictureModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ImagesService, useValue: imagesServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: NotiflixService, useValue: notiflixSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePictureModalComponent);
    component = fixture.componentInstance;
    component.model = 'user';
    component.modelId = '123';
    component.actualImageUrl = 'http://example.com/actual.jpg';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file selection and call uploadImage service', () => {
    const mockFile = new File(['dummy content'], 'photo.png', { type: 'image/png' });
    const event = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    const mockResponse = { imageUrl: 'http://uploaded.com/image.jpg' };
    imagesServiceSpy.uploadImage.and.returnValue(of(mockResponse));

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(mockFile);
    expect(imagesServiceSpy.uploadImage).toHaveBeenCalledWith(mockFile);
    expect(component.imageUrl).toBe('http://uploaded.com/image.jpg');
  });

  it('should show info if trying to upload with no file selected', () => {
    component.selectedFile = null;

    component.uploadImage();

    expect(notiflixSpy.showInfo).toHaveBeenCalled();
    expect(imagesServiceSpy.updateImage).not.toHaveBeenCalled();
  });

  it('should update image and delete old one if actualImageUrl exists', () => {
    const tempImageUrl = 'http://temp.com/new.jpg';
    imagesServiceSpy.updateImage.and.returnValue(of({}));
    imagesServiceSpy.deleteImage.and.returnValue(of({}));
    imagesServiceSpy.tempImageUrl = tempImageUrl;

    spyOn(component, 'closeModal');
    spyOn(component, 'exportNewImageUrl');
    component.selectedFile = new File(['dummy'], 'photo.png');
    component.imageUrl = tempImageUrl;

    component.uploadImage();

    expect(imagesServiceSpy.updateImage).toHaveBeenCalledWith('user', '123');
    expect(imagesServiceSpy.deleteImage).toHaveBeenCalledWith('http://example.com/actual.jpg');
    expect(usersServiceSpy.setUserPhoto).toHaveBeenCalledWith(tempImageUrl);
    expect(component.closeModal).toHaveBeenCalled();
    expect(component.exportNewImageUrl).toHaveBeenCalled();
  });

  it('should emit close on closeModal()', () => {
    spyOn(component.close, 'emit');

    component.closeModal();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit new image url on exportNewImageUrl()', () => {
    spyOn(component.newImageUrl, 'emit');
    component.imageUrl = 'http://someurl.com';

    component.exportNewImageUrl();

    expect(component.newImageUrl.emit).toHaveBeenCalledWith('http://someurl.com');
  });

  it('should not call deleteTmpImage if imageUrl does not exist', () => {
    component.imageUrl = null;

    spyOn(component, 'closeModal');

    component.onCancel();

    expect(imagesServiceSpy.deleteTmpImage).not.toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should not delete image if actualImageUrl is empty', () => {
    component.actualImageUrl = '';
    component.deleteImage();

    expect(imagesServiceSpy.deleteImage).not.toHaveBeenCalled();
  });

  it('should call deleteTmpImage only if tempImageUrl exists', () => {
    imagesServiceSpy.tempImageUrl = 'http://temp.com/img.jpg';
    imagesServiceSpy.deleteTmpImage.and.returnValue(of({}));

    component.deleteTmpImage();

    expect(imagesServiceSpy.deleteTmpImage).toHaveBeenCalled();
  });
});