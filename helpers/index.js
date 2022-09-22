const createPDF = require('./createPDF');
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const generateID = require('./generateID');
const getDates = require('./get-dates');
const htmlEmail = require('./html-email');
const uploadFiles = require('./upload-file');
const deleteEventByID = require('./delete-event');
const infoValidators = require('./info-validators');

module.exports = {
  ...createPDF,
  ...dbValidators,
  ...generateJWT,
  ...generateID,
  ...getDates,
  ...htmlEmail,
  ...uploadFiles,
  ...deleteEventByID,
  ...infoValidators,
};
