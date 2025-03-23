import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class XlsxService {

    async exportToExcel(debtors: any[]) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Delinquency Report');

        worksheet.columns = [
            { header: 'Id', key: 'debtorId', width: 10 },
            { header: 'Name', key: 'debtorName', width: 20 },
            { header: 'Installment Value', key: 'installmentValue', width: 20 },
            { header: 'Overdue Days', key: 'overdueDays', width: 15 },
            { header: 'Late Interests', key: 'lateInterests', width: 20 },
            { header: 'Total Installment Value', key: 'totalInstallmentValue', width: 25 },
            { header: 'Financing Status', key: 'financingStatus', width: 20 },
            { header: 'Manager', key: 'manager', width: 20 },
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
        const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const currentDate = new Date(2025, 2, 23);
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        saveAs(data, `delinquency-report-${formattedDate}.xlsx`);
    }
}
