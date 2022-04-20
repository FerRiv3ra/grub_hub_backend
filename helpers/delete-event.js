const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const Event = require("../models/event");

const deleteEventByID = (id) => {
  return new Promise(async (res, rej) => {
    const event = await Event.findByIdAndRemove(id);

    if (!event) {
      return rej(`There no event with ID ${id}`);
    }

    if (event.img) {
      const nameArr = event.img.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");

      cloudinary.uploader.destroy(public_id);
    }
    res(event);
  });
};

module.exports = {
  deleteEventByID,
};
