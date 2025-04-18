import express from 'express'
import { login } from '../controllers/auth/login.js'
import { register } from '../controllers/auth/register.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

export default router
