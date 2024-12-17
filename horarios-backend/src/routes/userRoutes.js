const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { check, param } = require('express-validator');
const {
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser // Nueva función importada
} = require('../controllers/userController');

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authMiddleware, getProfile);

// Ruta para obtener todos los usuarios (solo para admin)
router.get('/', authMiddleware, isAdmin, getAllUsers);

// Ruta para obtener un usuario específico por ID (solo para admin)
router.get('/:id', authMiddleware, isAdmin, [
  param('id').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido') // Validación del ID
], getUserById);

// Ruta para actualizar un usuario (solo para admin)
router.put('/:id', authMiddleware, isAdmin, [
  param('id').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'), // Validación del ID
  check('name').optional().isString().withMessage('El nombre debe ser un string'), // Validación del campo "name"
  check('email').optional().isEmail().withMessage('Debe ser un email válido'), // Validación del campo "email"
  check('role').optional().isIn(['admin', 'worker']).withMessage('El rol debe ser admin o worker') // Validación del campo "role"
], updateUser);

// Ruta para eliminar un usuario (solo para admin)
router.delete('/:id', authMiddleware, isAdmin, [
  param('id').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido') // Validación del ID
], deleteUser);

// Nueva ruta para crear un usuario (solo para administradores)
router.post(
  '/',
  authMiddleware,
  isAdmin,
  [
    check('name').notEmpty().isString().withMessage('El nombre es obligatorio y debe ser un string'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role')
      .optional()
      .isIn(['admin', 'worker'])
      .withMessage('El rol debe ser admin o worker')
  ],
  createUser
);

module.exports = router;




