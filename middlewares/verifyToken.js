const httpStatus = require("../utils/httpStatus");
const HttpError = require("../utils/httpError");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = HttpError.create(
      "token is required",
      httpStatus.UNAUTHORIZED,
      httpStatus.FAIL
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currectUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = currectUser;
    next();
  } catch (error) {
    const err = HttpError.create(
      "unauthorized user",
      httpStatus.UNAUTHORIZED,
      httpStatus.FAIL
    );
    return next(err);
  }
};

module.exports = verifyToken;
