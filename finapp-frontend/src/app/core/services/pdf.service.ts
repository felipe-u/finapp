import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class PdfService {

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
        doc.text('Delinquency Report', doc.internal.pageSize.width / 2, titleY, { align: 'center' });


        doc.setFontSize(10);
        const dateY = titleY + 8;
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width / 2, dateY, { align: 'center' });

        const tableStartY = dateY + 15;

        const columns = [
            'ID',
            'Name',
            'Installment value',
            'Overdue days',
            'Late interests',
            'Total Installment Value',
            'Financing Status',
            'Manager'
        ];

        const rows = debtors.map((debtor) => [
            debtor.debtorId,
            debtor.debtorName,
            `$${debtor.installmentValue.toFixed(2)}`,
            debtor.overdueDays,
            `$${debtor.lateInterests.toFixed(2)}`,
            `$${debtor.totalInstallmentValue.toFixed(2)}`,
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
