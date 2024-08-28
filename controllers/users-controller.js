const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const httpStatus = require("../utils/httpStatus");
const HttpError = require("../utils/httpError");
const generateJWT = require("../utils/generateJWT");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;

  const limit = query.limit || 2;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({
    status: httpStatus.SUCCESS,
    data: { users },
  });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    const error = HttpError.create(
      "user already exists",
      httpStatus.BAD_REQUEST,
      httpStatus.FAIL
    );
    return next(error);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 8);

  // create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // generate jwt token
  const token = await generateJWT({
    email: newUser.email,
    _id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { user: newUser },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = HttpError.create(
      "please provide email and password",
      httpStatus.BAD_REQUEST,
      httpStatus.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = HttpError.create(
      "user not found",
      httpStatus.NOT_FOUND,
      httpStatus.FAIL
    );
    return next(error);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = HttpError.create(
      "invalid credentials",
      httpStatus.UNAUTHORIZED,
      httpStatus.FAIL
    );
    return next(error);
  }

  const token = await generateJWT({
    email: user.email,
    _id: user._id,
    role: user.role,
  });

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { token },
  });
});

module.exports = {
  getAllUsers,
  login,
  register,
};
