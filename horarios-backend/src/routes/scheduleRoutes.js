const express = require('express');
const router = express.Router();
const { 
  createSchedule, 
  getSchedules, 
  updateSchedule, 
  deleteSchedule,
  getWorkerSchedule,
  updateShift,
  deleteShift 
} = require('../controllers/scheduleController');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { check, param } = require('express-validator');

// Validaciones comunes
const shiftValidations = [
  check('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora de inicio debe tener un formato válido (HH:MM)'),
  check('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora de fin debe tener un formato válido (HH:MM)')
];

// Crear un horario (solo admin)
router.post('/', 
  authMiddleware, 
  isAdmin, 
  [
    check('worker')
      .notEmpty()
      .withMessage('El ID del trabajador es obligatorio')
      .isMongoId()
      .withMessage('El ID del trabajador debe ser válido'),
    check('month')
      .isInt({ min: 1, max: 12 })
      .withMessage('El mes debe estar entre 1 y 12'),
    check('year')
      .isInt({ min: 2022 })
      .withMessage('El año debe ser mayor o igual a 2022'),
    check('shifts')
      .isArray()
      .withMessage('Los turnos deben ser un array')
  ], 
  createSchedule
);

// Obtener todos los horarios (requiere autenticación)
router.get('/', 
  authMiddleware, 
  getSchedules
);

// Obtener horarios de un trabajador específico
router.get('/worker/:workerId',
  authMiddleware,
  [
    param('workerId')
      .isMongoId()
      .withMessage('El ID del trabajador debe ser válido'),
    check('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('El mes debe estar entre 1 y 12'),
    check('year')
      .optional()
      .isInt({ min: 2022 })
      .withMessage('El año debe ser mayor o igual a 2022')
  ],
  getWorkerSchedule
);

// Actualizar un horario completo (solo admin)
router.put('/:id', 
  authMiddleware, 
  isAdmin, 
  [
    param('id')
      .isMongoId()
      .withMessage('El ID del horario debe ser un ObjectId válido'),
    check('worker')
      .optional()
      .isMongoId()
      .withMessage('El ID del trabajador debe ser válido'),
    check('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('El mes debe estar entre 1 y 12'),
    check('year')
      .optional()
      .isInt({ min: 2022 })
      .withMessage('El año debe ser mayor o igual a 2022'),
    check('shifts')
      .optional()
      .isArray()
      .withMessage('Los turnos deben ser un array')
  ], 
  updateSchedule
);

// Actualizar un turno específico
router.put('/shift/:shiftId',
  authMiddleware,
  isAdmin,
  [
    param('shiftId')
      .isMongoId()
      .withMessage('El ID del turno debe ser válido'),
    check('workerId')
      .isMongoId()
      .withMessage('El ID del trabajador debe ser válido'),
    ...shiftValidations
  ],
  updateShift
);

// Eliminar un horario completo (solo admin)
router.delete('/:id', 
  authMiddleware, 
  isAdmin, 
  [
    param('id')
      .isMongoId()
      .withMessage('El ID del horario debe ser un ObjectId válido')
  ], 
  deleteSchedule
);

// Eliminar un turno específico
router.delete('/shift/:shiftId',
  authMiddleware,
  isAdmin,
  [
    param('shiftId')
      .isMongoId()
      .withMessage('El ID del turno debe ser válido'),
    check('workerId')
      .isMongoId()
      .withMessage('El ID del trabajador debe ser válido')
  ],
  deleteShift
);

module.exports = router;

