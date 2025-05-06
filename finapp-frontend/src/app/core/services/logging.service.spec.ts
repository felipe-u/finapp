import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { environment } from '../../../environments/environment';

describe('LoggingService', () => {
    let service: LoggingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoggingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('log', () => {
        it('should call console.log when not in production', () => {
            const consoleLogSpy = spyOn(console, 'log');
            const mockMessage = 'Test log message';
            (environment as any).production = false;

            service.log(mockMessage);

            expect(consoleLogSpy).toHaveBeenCalledWith(mockMessage);
        });

        it('should not call console.log when in production', () => {
            const consoleLogSpy = spyOn(console, 'log');
            const mockMessage = 'Test log message';
            (environment as any).production = true;

            service.log(mockMessage);

            expect(consoleLogSpy).not.toHaveBeenCalled();
        });
    });

    describe('error', () => {
        it('should call console.error when not in production', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            const mockMessage = 'Test error message';
            (environment as any).production = false;

            service.error(mockMessage);

            expect(consoleErrorSpy).toHaveBeenCalledWith(mockMessage);
        });

        it('should not call console.error when in production', () => {
            const consoleErrorSpy = spyOn(console, 'error');
            const mockMessage = 'Test error message';
            (environment as any).production = true;

            service.error(mockMessage);

            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });
});