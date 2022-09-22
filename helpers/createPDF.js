const PDF = require('pdfkit-construct');
const fs = require('fs');

const createPDF = (start, final, usersArr = [], visits, totalHousehold) => {
  return new Promise((res, rej) => {
    const totalDonations = visits.reduce((total, visit) => {
      total += visit.amount;

      return total;
    }, 0);
    try {
      const users = usersArr.map((user, index) => {
        const amount = visits.reduce((total, visit) => {
          if (visit.customerId === user.customerId) {
            total += visit.amount;
          }

          return total;
        }, 0);

        return {
          index: index + 1,
          ...user._doc,
          amount: `£ ${amount}`,
        };
      });

      users.push({
        index: '',
        amount: `£ ${totalDonations}`,
        firstName: 'Total',
        lastName: '',
        housingProvider: '',
        postcode: '',
        visits: visits.length,
        noHousehold: totalHousehold,
      });

      const doc = new PDF({
        size: 'LETTER',
        margins: { top: 20, left: 20, right: 20, bottom: 20 },
        bufferPages: true,
      });

      doc.setDocumentHeader(
        {
          height: '16%',
        },
        () => {
          doc.image('./assets/lvc.png', 256, 15, {
            fit: [100, 100],
            valign: 'center',
          });

          doc
            .fill('#444')
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(`COMMUNITY CUPBOARD REPORT`, 0, 110, {
              underline: true,
              width: 590,
              align: 'center',
            });

          doc
            .fill('#444')
            .fontSize(12)
            .font('Helvetica')
            .text(`Start date: ${start.toDateString()}`, 60, 130, {
              align: 'left',
            });

          doc
            .fill('#444')
            .fontSize(12)
            .font('Helvetica')
            .text(`End date: ${final.toDateString()}`, 350, 130, {
              align: 'left',
            });
        }
      );

      doc.setDocumentFooter({}, () => {
        doc
          .lineJoin('miter')
          .rect(
            0,
            doc.footer.y,
            doc.page.width,
            doc.footer.options.heightNumber
          )
          .fill('#B7DCCC');

        doc
          .fill('#444')
          .fontSize(10)
          .text(
            `The Vine Centre © ${new Date().getFullYear()}`,
            doc.footer.x,
            doc.footer.y + 5
          );

        doc.setPageNumbers((p, c) => `Page ${p} of ${c}`, 'top right');
      });

      doc.addTable(
        [
          { key: 'index', label: 'Index', align: 'center' },
          { key: 'firstName', label: 'First Name', align: 'left' },
          { key: 'lastName', label: 'Last Name', align: 'left' },
          { key: 'postcode', label: 'Postcode', align: 'center' },
          {
            key: 'housingProvider',
            label: 'Housing Provider',
            align: 'center',
          },
          {
            key: 'noHousehold',
            label: 'No in household',
            align: 'center',
          },
          {
            key: 'amount',
            label: 'Donations',
            align: 'center',
          },
          { key: 'visits', label: 'Visits', align: 'center' },
        ],
        users,
        {
          border: null,
          headBackground: '#336210',
          headColor: '#FFF',
          width: 'fill_body',
          striped: true,
          stripedColors: ['#FFF', '#EEE'],
          marginLeft: 20,
          marginRight: 20,
          headHeight: 20,
          cellsPadding: 3,
          cellsFontSize: 9,
          cellHeight: 10,
          headAlign: 'center',
        }
      );

      doc.render();

      doc.pipe(
        fs.createWriteStream(
          `./uploads/report${final.toISOString().slice(0, 10)}.pdf`
        )
      );
      doc.end();

      res({ ok: true });
    } catch (error) {
      rej({ error: 'Cannot create report' });
    }
  });
};

module.exports = createPDF;
