import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/db.js'
import { validateLogin } from '../../utils/validator/authValidator.js'

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    const { error } = validateLogin({ email, password })
    if (error) {
      return res.status(422).json({ success: false, error: error.details[0].message })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token
      }
    })

  } catch (err) {
    console.error('Login Error:', err)
    next(err)
  }
}
