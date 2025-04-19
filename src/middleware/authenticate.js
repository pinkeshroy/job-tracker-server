import jwt from 'jsonwebtoken';
import prisma from '../config/db.js'; // Ensure correct extension if using ESModules

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('[auth] Incoming token:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // returns: { id, name, role, iat, exp }

    // Optionally: Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    // Attach decoded user info
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error('[auth error]', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
