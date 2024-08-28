const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 5 })
      .withMessage("title must be at least 5 chars"),
    body("price").notEmpty().withMessage("price is required"),
  ];
};

module.exports = { validationSchema };
