const express = require("express");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    const error = httpError.create(
      "only images are allowed",
      httpStatus.BAD_REQUEST,
      httpStatus.FAIL
    );
    return cb(error, false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

const verifyToken = require("../middlewares/verifyToken");
const usersController = require("../controllers/users-controller");
const httpError = require("../utils/httpError");

const router = express.Router();

router.route("/").get(verifyToken, usersController.getAllUsers);

router.route("/login").post(usersController.login);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

module.exports = router;
