const Joi = require("joi");

const createPaymentSchema = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  currency: Joi.string().trim().uppercase().length(3).default("NGN"),
  reference: Joi.string().trim().min(3).max(120).required(),
  method: Joi.string().valid("cash", "transfer", "card", "pos", "other").default("transfer"),
  status: Joi.string().valid("pending", "confirmed", "reversed").default("confirmed"),
  paidAt: Joi.date().optional(),
  note: Joi.string().trim().max(500).optional().allow(""),
  aydId: Joi.string().uuid().optional().allow(null, ""),
});

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "reversed").required(),
});

module.exports = { createPaymentSchema, updatePaymentStatusSchema };
