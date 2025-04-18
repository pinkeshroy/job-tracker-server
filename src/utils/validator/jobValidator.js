import Joi from "joi";

export const validateJob = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    company: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    location: Joi.string().optional().allow(null, ""),
    salaryRange: Joi.string().optional().allow(null, ""),
  });

  return schema.validate(data);
};

// For updating a job (partial update allowed)
export const validateJobUpdate = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    company: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).optional(),
    location: Joi.string().optional().allow(null, ""),
    salaryRange: Joi.string().optional().allow(null, ""),
  }).min(1); // At least one field must be provided

  return schema.validate(data);
};
