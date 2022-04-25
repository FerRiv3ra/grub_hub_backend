const { response } = require('express');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFiles } = require('../helpers');
const { validFileExt } = require('../helpers/upload-file');
const { Event } = require('../models');

const uploadFile = async (req, res = response) => {
  try {
    // const fileName = await uploadFiles(req.files, ['txt', 'docx'], 'text');
    const fileName = await uploadFiles(req.files);

    res.json({ fileName });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const updateImg = async (req, res) => {
  const { id, collection } = req.params;

  try {
    await validFileExt(req.files);

    let model;
    switch (collection) {
      case 'events':
        model = await Event.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: `Event with ID ${id} not exists` });
        }
        break;

      default:
        return res.status(500).json({ msg: 'Cellection no added' });
    }

    // Clean img
    if (model.img) {
      const nameArr = model.img.split('/');
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split('.');

      cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    model.save();

    res.json(model);
  } catch (msg) {
    return res.status(400).json({ msg });
  }
};

module.exports = { uploadFile, updateImg };
