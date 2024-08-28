const httpStatus = require("../utils/httpStatus");
const HttpError = require("../utils/httpError");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = HttpError.create(
        "this user is not authorized",
        httpStatus.UNAUTHORIZED,
        httpStatus.FAIL
      );

      return next(error);
    }
    next();
  };
};

module.exports = allowedTo;
