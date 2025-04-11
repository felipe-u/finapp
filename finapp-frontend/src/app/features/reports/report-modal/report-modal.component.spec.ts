import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportModalComponent } from './report-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ClientsService } from '../../../core/services/clients.service';
import { PdfService } from '../../../core/services/pdf.service';
import { XlsxService } from '../../../core/services/xlsx.service';
import { of, throwError } from 'rxjs';

describe('ReportModalComponent', () => {
  let component: ReportModalComponent;
  let fixture: ComponentFixture<ReportModalComponent>;
  let clientsService: jasmine.SpyObj<ClientsService>;
  let pdfService: jasmine.SpyObj<PdfService>;
  let xlsxService: jasmine.SpyObj<XlsxService>;

  beforeEach(async () => {
    const clientsSpy = jasmine.createSpyObj('ClientsService', ['getDebtorsForReport']);
    const pdfSpy = jasmine.createSpyObj('PdfService', ['generatePDF']);
    const xlsxSpy = jasmine.createSpyObj('XlsxService', ['exportToExcel']);

    await TestBed.configureTestingModule({
      imports: [
        ReportModalComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ClientsService, useValue: clientsSpy },
        { provide: PdfService, useValue: pdfSpy },
        { provide: XlsxService, useValue: xlsxSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportModalComponent);
    component = fixture.componentInstance;
    clientsService = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;
    pdfService = TestBed.inject(PdfService) as jasmine.SpyObj<PdfService>;
    xlsxService = TestBed.inject(XlsxService) as jasmine.SpyObj<XlsxService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDebtorsForReport on init and set data', fakeAsync(() => {
    const mockData = [{ debtorId: 1, debtorName: 'Juan' }];
    clientsService.getDebtorsForReport.and.returnValue(of(mockData));

    component.reportType = 'delayed';
    component.daysGap = '30';
    component.ngOnInit();
    tick();

    expect(clientsService.getDebtorsForReport).toHaveBeenCalledWith('delayed', '30');
    expect(component.debtorsInfo()).toEqual(mockData);
    expect(component.loadingData).toBeFalse();
  }));

  it('should handle error from getDebtorsForReport', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    clientsService.getDebtorsForReport.and.returnValue(throwError(() => new Error('error')));

    component.reportType = 'test';
    component.daysGap = '10';
    component.ngOnInit();
    tick();

    expect(clientsService.getDebtorsForReport).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
    expect(component.loadingData).toBeFalse();
  }));

  it('should call generatePDF with debtorsInfo', () => {
    const data = [{ debtorId: 1 }];
    component.debtorsInfo.set(data);

    component.generatePDF();

    expect(pdfService.generatePDF).toHaveBeenCalledWith(data);
  });

  it('should call generateExcel with debtorsInfo', () => {
    const data = [{ debtorId: 1 }];
    component.debtorsInfo.set(data);

    component.generateExcel();

    expect(xlsxService.exportToExcel).toHaveBeenCalledWith(data);
  });

  it('should emit close event on closeModal', () => {
    spyOn(component.close, 'emit');

    component.closeModal();

    expect(component.close.emit).toHaveBeenCalled();
  });
});