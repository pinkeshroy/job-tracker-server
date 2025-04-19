import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/db.js'
import { validateRegister } from '../../utils/validator/authValidator.js'

const JWT_SECRET = process.env.JWT_SECRET;

// Only allowed roles at registration
const ALLOWED_ROLES = ['USER', 'RECRUITER']

export const register = async (req, res, next) => {
  try {
    let { email, password, name, role = 'USER' } = req.body

    // Force role to uppercase just in case (optional)
    role = role.toUpperCase()

    // Prevent role elevation to ADMIN or anything else
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Only ${ALLOWED_ROLES.join(' or ')} are allowed.`
      })
    }

    // Validate fields
    const { error } = validateRegister({ email, password, name, role })
    if (error) {
      return res.status(422).json({ success: false, error: error.details[0].message })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role },
      select: { id: true, email: true, name: true, role: true }
    })

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '2h' })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    next(err)
  }
}
