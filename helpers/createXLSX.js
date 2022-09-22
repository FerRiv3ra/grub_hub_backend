const ExcelJS = require('exceljs');
const fs = require('fs');

const createXLSX = (final, usersArr = [], visits, totalHousehold) => {
  return new Promise((res, rej) => {
    const totalDonations = visits.reduce((total, visit) => {
      total += visit.amount;

      return total;
    }, 0);
    try {
      const users = usersArr.map((user, index) => {
        const { pensioner, ...rest } = user;

        const amount = visits.reduce((total, visit) => {
          if (visit.customerId === user.customerId) {
            total += visit.amount;
          }

          return total;
        }, 0);

        return {
          index: index + 1,
          ...rest._doc,
          amount: `£ ${amount}`,
          pensioner: pensioner ? 'Yes' : 'No',
        };
      });

      users.push({
        amount: `£ ${totalDonations}`,
        firstName: 'Total',
        visits: visits.length,
        noHousehold: totalHousehold,
      });

      const workbook = new ExcelJS.Workbook();

      workbook.creator = 'Fernando Rivera';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Report');

      worksheet.columns = [
        { header: 'Item', key: 'index', width: 6 },
        { header: 'First Name', key: 'firstName', width: 20 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'Phone number', key: 'phone', width: 20 },
        { header: 'Number in Household', key: 'noHousehold', width: 18 },
        { header: 'Children', key: 'childCant', width: 12 },
        { header: 'Address', key: 'address', width: 25 },
        { header: 'Postcode', key: 'postcode', width: 10 },
        { header: 'Town', key: 'town', width: 10 },
        { header: 'Housing Provider', key: 'housingProvider', width: 20 },
        { header: 'Pensioner', key: 'pensioner', width: 20 },
        { header: 'Total donations', key: 'amount', width: 15 },
        { header: 'Number of Visits', key: 'visits', width: 15 },
      ];

      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };

      users.forEach((user) => {
        worksheet.addRow(user);
      });

      const figureColumns = [1, 5, 6, 9, 10, 11, 12, 13];
      figureColumns.forEach((i) => {
        worksheet.getColumn(i).alignment = { horizontal: 'center' };
      });

      const firstColumn = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
      ];

      worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'none' },
        };

        firstColumn.forEach((v) => {
          worksheet.getCell(`${v}${rowNumber}`).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'none' },
            right: { style: 'none' },
          };
        });

        worksheet.getCell(`F${rowNumber}`).border = {
          top: { style: 'thin' },
          left: { style: 'none' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      firstColumn.forEach((col) => {
        worksheet.getCell(`${col}1`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '336210' },
          bgColor: { argb: '336210' },
        };
      });

      workbook.xlsx.writeFile(
        `./uploads/report${final.toISOString().slice(0, 10)}.xlsx`
      );

      res({ ok: true });
    } catch (error) {
      rej({ error: 'Cannot create report' });
    }
  });
};

module.exports = createXLSX;
