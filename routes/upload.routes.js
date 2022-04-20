const { Router } = require("express");
const { check } = require("express-validator");
const { uploadFile, updateImg } = require("../controllers/uploads");
const { validColection } = require("../helpers/db-validators");
const { validateFields, validateFile } = require("../middlewares");

const router = Router();

router.post("/", validateFile, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "Is not valid ID").isMongoId(),
    check("collection").custom((c) => validColection(c, ["events"])),
    validateFields,
  ],
  updateImg
);

module.exports = router;
