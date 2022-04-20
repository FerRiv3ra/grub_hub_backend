const path = require("path");
const generateID = require("./generateID");

const uploadFiles = (
  files,
  validExt = ["jpg", "jpeg", "png", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const splitName = file.name.split(".");
    const ext = splitName[splitName.length - 1];

    if (!validExt.includes(ext)) {
      return reject(`Extension ${ext} is no valid`);
    }

    const tempName = generateID() + "." + ext;

    uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

const validFileExt = (files, validExt = ["jpg", "jpeg", "png", "gif"]) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const splitName = file.name.split(".");
    const ext = splitName[splitName.length - 1];

    if (!validExt.includes(ext)) {
      return reject(`Extension ${ext} is no valid`);
    }

    resolve(true);
  });
};

module.exports = {
  uploadFiles,
  validFileExt,
};
