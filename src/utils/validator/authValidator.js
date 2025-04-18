// validators/authValidator.js
import Joi from 'joi'

export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
    role: Joi.string().valid('USER', 'RECRUITER', 'ADMIN').optional()
  })
  return schema.validate(data)
}


export const validateLogin = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
    return schema.validate(data)
  }