import { TestBed } from '@angular/core/testing';
import { ImagesService } from './images.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('ImagesService', () => {
    let service: ImagesService;
    let httpMock: HttpTestingController;
    const SERVER_URL = environment.SERVER_URL;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImagesService]
        });

        service = TestBed.inject(ImagesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should upload image and store tempImageUrl', () => {
        const fakeFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const fakeResponse = { imageUrl: `${SERVER_URL}/uploads/test.png` };

        service.uploadImage(fakeFile).subscribe(response => {
            expect(response).toEqual(fakeResponse);
            expect(service.tempImageUrl).toBe(fakeResponse.imageUrl);
        });

        const req = httpMock.expectOne(`${SERVER_URL}/upload`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body instanceof FormData).toBeTrue();

        req.flush(fakeResponse);
    });

    it('should update image using tempImageUrl', () => {
        service.tempImageUrl = `${SERVER_URL}/uploads/test.png`;
        const model = 'user';
        const modelId = '123';

        service.updateImage(model, modelId)?.subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/imgs/${model}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({
            modelId: modelId,
            imageUrl: service.tempImageUrl
        });

        req.flush({ success: true });
    });

    it('should send DELETE request for image URL', () => {
        const imageUrl = `${SERVER_URL}/uploads/test.png`;

        service.deleteImage(imageUrl).subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/delete-image?imageUrl=${encodeURIComponent(imageUrl)}`);
        expect(req.request.method).toBe('DELETE');

        req.flush({ success: true });
    });

    it('should delete temp image if tempImageUrl exists', () => {
        service.tempImageUrl = `${SERVER_URL}/uploads/test.png`;

        service.deleteTmpImage()?.subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/delete-image?imageUrl=${encodeURIComponent(service.tempImageUrl)}`);
        expect(req.request.method).toBe('DELETE');

        req.flush({ success: true });
    });

    it('should not send request if tempImageUrl is null in deleteTmpImage', () => {
        service.tempImageUrl = null;

        const result = service.deleteTmpImage();

        expect(result).toBeUndefined();
    });

    it('should delete multiple images and clear tempImageUrl if included', () => {
        const images = [
            `${SERVER_URL}/uploads/img1.png`,
            `${SERVER_URL}/uploads/img2.png`
        ];
        service.tempImageUrl = images[0];

        service.deleteImages(images).subscribe();

        const req = httpMock.expectOne(`${SERVER_URL}/delete-images`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ images });

        req.flush({ success: true });
        expect(service.tempImageUrl).toBeNull();
    });
});
