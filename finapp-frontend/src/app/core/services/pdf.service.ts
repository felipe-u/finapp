import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class PdfService {
    private translate = inject(TranslateService);

    generatePDF(debtors: any[]) {
        const doc = new jsPDF();

        const logoUrl = 'assets/imgs/logo.png';
        const originalWidth = 351;
        const originalHeight = 156;
        const imgWidth = originalWidth / 10;
        const imgHeight = originalHeight / 10;
        const imgX = (doc.internal.pageSize.width - imgWidth) / 2;
        const imgY = 10;
        doc.addImage(logoUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

        doc.setFontSize(20);
        const titleY = imgY + imgHeight + 10;
        doc.text(
            this.translate.instant('UI.REPORTS.DEL_REP'),
            doc.internal.pageSize.width / 2,
            titleY,
            { align: 'center' }
        );

        doc.setFontSize(10);
        const dateY = titleY + 8;
        doc.text(
            `${this.translate.instant('UI.REPORTS.GENERATE_ON')}: ${new Date().toLocaleDateString()}`,
            doc.internal.pageSize.width / 2,
            dateY,
            { align: 'center' }
        );

        const tableStartY = dateY + 15;

        const columns = [
            'ID',
            this.translate.instant('FIELDS.NAME'),
            this.translate.instant('UI.CLIENTS.FINANCING.INST_VALUE'),
            this.translate.instant('UI.CLIENTS.FINANCING.OVERDUE_DAYS'),
            this.translate.instant('UI.CLIENTS.FINANCING.LATE_INT'),
            this.translate.instant('UI.CLIENTS.FINANCING.TOTAL_VALUE'),
            this.translate.instant('FIELDS.STATUS'),
            this.translate.instant('FIELDS.MANAGER'),
        ];

        const rows = debtors.map((debtor) => [
            debtor.debtorId,
            debtor.debtorName,
            new Intl.NumberFormat(
                'en-US',
                { style: 'currency', currency: 'USD' }).format(debtor.installmentValue),
            debtor.overdueDays,
            new Intl.NumberFormat(
                'en-US',
                { style: 'currency', currency: 'USD' }).format(debtor.lateInterests),
            new Intl.NumberFormat(
                'en-US',
                { style: 'currency', currency: 'USD' }).format(debtor.totalInstallmentValue),
            debtor.financingStatus,
            debtor.manager
        ]);

        autoTable(doc, {
            startY: tableStartY,
            head: [columns],
            body: rows,
            styles: {
                fontSize: 10,
                halign: 'center',
                valign: 'middle'
            },
            headStyles: { fillColor: [40, 40, 40], halign: 'center' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        doc.save(`delinquency-report-${formattedDate}.pdf`);
    }

}
