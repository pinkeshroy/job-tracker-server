import Joi from "joi";

export const validateJobIdQuery = (query) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("APPLIED", "INTERVIEW", "REJECTED", "OFFERED", "ON_HOLD")
      .optional(),
    sortBy: Joi.string().valid("appliedAt", "updatedAt").optional(),
    order: Joi.string().valid("asc", "desc").optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  });

  return schema.validate(query);
};

export const validateJobApplication = (data) => {
  const schema = Joi.object({
    coverLetter: Joi.string().max(2000).optional(),
    resumeUrl: Joi.string().uri().required(),
  });

  return schema.validate(data);
};

export const validateGetApplications = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid(
    "APPLIED",
    "INTERVIEW",
    "REJECTED",
    "OFFERED",
    "ON_HOLD"
  ),
  sortBy: Joi.string()
    .valid("appliedAt", "updatedAt", "status")
    .default("appliedAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
});

export const validateUserUpdateApplication = Joi.object({
    coverLetter: Joi.string().max(2000).optional(),
    resumeUrl: Joi.string().uri().optional(),
    status: Joi.forbidden()
  })