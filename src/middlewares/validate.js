const ErrorResponse = require("../utils/errorResponse");

const validate = (schema, source = "body") => (req, _res, next) => {
  if (!schema) return next();
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    const message = error.details.map((d) => d.message).join("; ");
    return next(new ErrorResponse(message, 400));
  }
  req[source] = value;
  next();
};

module.exports = validate;
