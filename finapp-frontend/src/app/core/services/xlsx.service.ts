import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class XlsxService {
    private translate = inject(TranslateService);

    async exportToExcel(debtors: any[]) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Delinquency Report');

        worksheet.columns = [
            { header: 'Id', key: 'debtorId', width: 10 },
            {
                header: this.translate.instant('FIELDS.NAME'),
                key: 'debtorName',
                width: 20
            },
            {
                header: this.translate.instant('UI.CLIENTS.FINANCING.INST_VALUE'),
                key: 'installmentValue',
                width: 20
            },
            {
                header: this.translate.instant('UI.CLIENTS.FINANCING.OVERDUE_DAYS'),
                key: 'overdueDays',
                width: 15
            },
            {
                header: this.translate.instant('UI.CLIENTS.FINANCING.LATE_INT'),
                key: 'lateInterests',
                width: 20
            },
            {
                header: this.translate.instant('UI.CLIENTS.FINANCING.TOTAL_VALUE'),
                key: 'totalInstallmentValue',
                width: 25
            },
            {
                header: this.translate.instant('FIELDS.STATUS'),
                key: 'financingStatus',
                width: 20
            },
            {
                header: this.translate.instant('FIELDS.MANAGER'),
                key: 'manager',
                width: 20
            },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        debtors.forEach((debtor) => {
            worksheet.addRow({
                debtorId: debtor.debtorId,
                debtorName: debtor.debtorName,
                installmentValue: debtor.installmentValue,
                overdueDays: debtor.overdueDays,
                lateInterests: debtor.lateInterests,
                totalInstallmentValue: debtor.totalInstallmentValue,
                financingStatus: debtor.financingStatus,
                manager: debtor.manager,
            });
        });

        worksheet.getColumn('installmentValue').numFmt = '"$"#,##0.00';
        worksheet.getColumn('lateInterests').numFmt = '"$"#,##0.00';
        worksheet.getColumn('totalInstallmentValue').numFmt = '"$"#,##0.00';

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const data = new Blob([buffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        saveAs(data, `delinquency-report-${formattedDate}.xlsx`);
    }
}
