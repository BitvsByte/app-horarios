const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

// Rutas con validaciones
router.post('/register', [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('role').optional().isIn(['admin', 'worker']).withMessage('El rol debe ser admin o worker')
], register);

router.post('/login', [
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').notEmpty().withMessage('La contraseña es obligatoria')
], login);



module.exports = router;
