const { validationResult } = require("express-validator");

const Course = require("../models/course.model");
const httpStatus = require("../utils/httpStatus");
const HttpError = require("../utils/httpError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getCourses = asyncWrapper(async (req, res, next) => {
  const query = req.query;

  const limit = query.limit || 2;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({
    status: httpStatus.SUCCESS,
    data: { courses },
  });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    const error = HttpError.create(
      "course not found",
      httpStatus.NOT_FOUND,
      httpStatus.FAIL
    );
    return next(error);
  }
  return res.json({
    status: httpStatus.SUCCESS,
    data: { course },
  });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = HttpError.create(
      errors.array(),
      httpStatus.BAD_REQUEST,
      httpStatus.FAIL
    );
    return next(error);
  }

  const { title, price } = req.body;
  const newCourse = new Course({ title, price });
  await newCourse.save();
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { course: newCourse },
  });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  let updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
    // return the updated document & enforce schema validation
  );

  if (!updateCourse) {
    const error = HttpError.create(
      "course not found",
      httpStatus.NOT_FOUND,
      httpStatus.FAIL
    );
    return next(error);
  }

  return res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);

  if (!deletedCourse) {
    const error = HttpError.create(
      "course not found",
      httpStatus.NOT_FOUND,
      httpStatus.FAIL
    );
    return next(error);
  }

  return res.status(200).json({
    status: httpStatus.SUCCESS,
    data: null,
  });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
