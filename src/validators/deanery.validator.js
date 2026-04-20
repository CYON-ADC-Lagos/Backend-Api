const Joi = require("joi");

const createDeanerySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().lowercase().trim().optional().allow(""),
  meetingDay: Joi.string().trim().max(40).optional().allow(""),
  time: Joi.string().trim().max(20).optional().allow(""),
  phoneNumber: Joi.string().trim().max(20).optional().allow(""),
  youtube: Joi.string().uri().optional().allow(""),
  instagram: Joi.string().uri().optional().allow(""),
  facebook: Joi.string().uri().optional().allow(""),
  twitter: Joi.string().uri().optional().allow(""),
});

const updateDeanerySchema = createDeanerySchema.fork(
  Object.keys(createDeanerySchema.describe().keys),
  (s) => s.optional()
).min(1);

module.exports = { createDeanerySchema, updateDeanerySchema };
