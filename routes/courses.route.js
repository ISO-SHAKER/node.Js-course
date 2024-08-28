const express = require("express");

const userRoles = require("../utils/userRoles");
const coursesController = require("../controllers/courses-controller");

const router = express.Router();

const { validationSchema } = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(coursesController.getCourses)
  .post(validationSchema(), coursesController.addCourse);

router
  .route("/:id")
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
