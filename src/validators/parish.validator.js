const Joi = require("joi");

const createParishSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().lowercase().trim().required(),
  location: Joi.string().trim().max(240).optional().allow(""),
  deaneryId: Joi.string().uuid().required(),
  meetingDay: Joi.string().trim().max(40).optional().allow(""),
  time: Joi.string().trim().max(20).optional().allow(""),
  hasPaid: Joi.boolean().truthy(1, "1", "true").falsy(0, "0", "false").optional(),
});

const updateParishSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  email: Joi.string().email().lowercase().trim(),
  location: Joi.string().trim().max(240).allow(""),
  deaneryId: Joi.string().uuid(),
  meetingDay: Joi.string().trim().max(40).allow(""),
  time: Joi.string().trim().max(20).allow(""),
  hasPaid: Joi.boolean().truthy(1, "1", "true").falsy(0, "0", "false"),
}).min(1);

module.exports = { createParishSchema, updateParishSchema };
