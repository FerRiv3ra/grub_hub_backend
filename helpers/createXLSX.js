const ExcelJS = require('exceljs');
const fs = require('fs');

const createXLSX = (start, final, usersArr = [], visits, totalHousehold) => {
  return new Promise((res, rej) => {
    try {
      const users = usersArr.map((user, index) => {
        const {
          customer_id,
          housing_provider,
          name,
          no_household,
          postcode,
          visits,
        } = user;
        return {
          index: index + 1,
          customer_id,
          housing_provider,
          name,
          no_household,
          postcode,
          visits,
        };
      });

      users.push({
        index: '',
        name: 'Total',
        housing_provider: '',
        postcode: '',
        visits,
        no_household: totalHousehold,
      });

      const workbook = new ExcelJS.Workbook();

      workbook.creator = 'Fernando Rivera';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Report');

      worksheet.columns = [
        { header: 'Item', key: 'index', width: 6 },
        { header: 'Full Name', key: 'name', width: 24 },
        { header: 'Postcode', key: 'postcode', width: 10 },
        { header: 'Housing Provider', key: 'housing_provider', width: 20 },
        { header: 'Number in Household', key: 'no_household', width: 18 },
        { header: 'Number of Visits ', key: 'visits', width: 15 },
      ];

      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };

      users.forEach((user) => {
        worksheet.addRow(user);
      });

      const figureColumns = [1, 5, 6];
      figureColumns.forEach((i) => {
        worksheet.getColumn(i).alignment = { horizontal: 'center' };
      });

      worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        worksheet.getCell(`A${rowNumber}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'none' },
        };

        const insideColumns = ['B', 'C', 'D', 'E'];
        insideColumns.forEach((v) => {
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

      const firstRow = ['A', 'B', 'C', 'D', 'E', 'F'];
      firstRow.forEach((col) => {
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

      res({ msg: `OK` });
    } catch (error) {
      rej({ error: 'Cannot create report' });
    }
  });
};

module.exports = createXLSX;
