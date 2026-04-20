const Joi = require("joi");

const createEventSchema = Joi.object({
  name: Joi.string().trim().min(2).max(240).required(),
  description: Joi.string().trim().max(5000).required(),
  date: Joi.date().required(),
  time: Joi.string().trim().max(20).required(),
  venue: Joi.string().trim().max(240).optional().allow(""),
  adcId: Joi.string().trim().max(80).optional().allow(""),
  deaneryId: Joi.string().uuid().optional().allow(null, ""),
});

const updateEventSchema = Joi.object({
  name: Joi.string().trim().min(2).max(240),
  description: Joi.string().trim().max(5000),
  date: Joi.date(),
  time: Joi.string().trim().max(20),
  venue: Joi.string().trim().max(240).allow(""),
  adcId: Joi.string().trim().max(80).allow(""),
  deaneryId: Joi.string().uuid().allow(null, ""),
}).min(1);

module.exports = { createEventSchema, updateEventSchema };
