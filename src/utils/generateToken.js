import jwt from 'jsonwebtoken'

export const generateToken = (payload, expiresIn = '2h') => {
  const secret = process.env.JWT_SECRET || 'supersecretkey'
  return jwt.sign(payload, secret, { expiresIn })
}
