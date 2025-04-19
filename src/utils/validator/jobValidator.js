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

export const validateJobQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('createdAt', 'title', 'status')
      .default('createdAt'),
    order: Joi.string().valid('asc', 'desc').insensitive().default('desc'),
    status: Joi.string().valid('OPEN', 'CLOSED', 'ON_HOLD').optional(),
    recruiterId: Joi.number().integer().optional(),
    title: Joi.string().optional(),
  });

  return schema.validate(query);
};