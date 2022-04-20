const { Router } = require("express");
const { check } = require("express-validator");
const {
  postEvent,
  getEvents,
  putEvent,
  deleteEvent,
} = require("../controllers/events");
const { validEvent } = require("../helpers/db-validators");
const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const router = Router();

router.get("/", getEvents);

router.post(
  "/",
  [
    validateJWT,
    isAdminRole,
    check("title", "Title is required").not().isEmpty(),
    validateFields,
  ],
  postEvent
);

router.put(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Id is required").not().isEmpty(),
    check("id", "Is not valid ID").isMongoId(),
    check("id").custom(validEvent),
    validateFields,
  ],
  putEvent
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Id is required").not().isEmpty(),
    check("id", "Is not valid ID").isMongoId(),
    check("id").custom(validEvent),
    validateFields,
  ],
  deleteEvent
);

module.exports = router;
