const PDF = require('pdfkit-construct');
const fs = require('fs');

const createPDF = (start, final, usersArr = [], visits, totalHousehold) => {
  return new Promise((res, rej) => {
    try {
      const users = usersArr.map((user, index) => {
        const { customer_id, housing_provider, name, no_household, postcode, visits } = user;
        return { index: index + 1, customer_id, housing_provider, name, no_household, postcode, visits };
      });
    
      users.push({
        index: '',
        name: 'Total',
        housing_provider: '',
        postcode: '',
        visits,
        no_household: totalHousehold
      });
    
      const doc = new PDF({
        size: 'LETTER',
        margins: { top: 20, left: 25, right: 25, bottom: 20 },
        bufferPages: true,
      });
    
      doc.setDocumentHeader({
        height: '16%'
      }, () => {
        doc.image('./assets/lvc.png', 256, 15, { fit: [100, 100], valign: 'center' });
    
        doc.fill('#444')
          .fontSize(16)
          .font('Helvetica-Bold')
          .text(`COMMUNITY CUPBOARD REPORT`, 0, 110, {
            underline: true,
            width: 590,
            align: 'center'
          });
    
        doc.fill('#444')
          .fontSize(12)
          .font('Helvetica')
          .text(`Start date: ${start.toDateString()}`, 60, 130, {
            align: 'left'
          });
    
        doc.fill('#444')
          .fontSize(12)
          .font('Helvetica')
          .text(`End date: ${final.toDateString()}`, 350, 130, {
            align: 'left'
          });
      });
    
      doc.setDocumentFooter({}, () => {
        doc.lineJoin('miter')
          .rect(0, doc.footer.y, doc.page.width, doc.footer.options.heightNumber).fill("#B7DCCC");
    
        doc.fill("#444")
          .fontSize(10)
          .text(`The Vine Centre © ${new Date().getFullYear()}`, doc.footer.x, doc.footer.y + 5);
    
        doc.setPageNumbers((p, c) => `Page ${p} of ${c}`, 'top right');
      });
    
        doc.addTable(
          [
            { key: 'index', label: 'Index', align: 'center' },
            { key: 'name', label: 'Name', align: 'left' },
            { key: 'postcode', label: 'Postcode', align: 'center' },
            { key: 'housing_provider', label: 'Housing Provider', align: 'center' },
            { key: 'no_household', label: 'Number in household', align: 'center' },
            { key: 'visits', label: 'Total visits', align: 'center' }
          ],
          users, {
          border: null,
          headBackground: '#336210',
          headColor: '#FFF',
          width: "fill_body",
          striped: true,
          stripedColors: ["#FFF", "#EEE"],
          marginLeft: 20,
          marginRight: 20,
          headHeight : 20,
          cellsPadding : 3,
          cellsFontSize : 9,
          cellHeight: 10,
          headAlign: 'center',
        })
    
      doc.render();
    
      doc.pipe(fs.createWriteStream(`./PDFs/report${final.toISOString().slice(0, 10)}.pdf`));
      doc.end();

      res({msg: `OK`});
    } catch (error) {
      rej({error: 'Cannot create report'})
    }
  })
}

module.exports = createPDF;