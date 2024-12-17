// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Extraer el token del encabezado
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token' });
    }

    // Verificar el token y añadir los datos del usuario a req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  try {
    // Verificar si req.user existe y si el rol es "admin"
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: solo para administradores' });
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Error en la verificación de administrador', error: error.message });
  }
};

module.exports = { authMiddleware, isAdmin };
