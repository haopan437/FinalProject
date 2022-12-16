const Validator = require("validator");

module.exports = function (data) {
  let errors = {};

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must between 6 and 30 characters";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
