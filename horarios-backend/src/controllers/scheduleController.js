const Schedule = require('../models/Schedule');
const { validationResult } = require('express-validator');

// Crear un horario
const createSchedule = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const schedule = await Schedule.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los horarios
// controllers/scheduleController.js
const getSchedules = async (req, res) => {
  try {
    const { worker } = req.query;
    const schedules = await Schedule.find({ worker })
      .populate('worker', 'name')
      .populate('createdBy', 'name')
      .lean(); // Añadimos lean() para obtener objetos planos

    console.log('Schedules encontrados:', JSON.stringify(schedules, null, 2)); // Para ver la estructura completa
    res.json(schedules);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un horario
const updateSchedule = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

// Eliminar un horario
const deleteSchedule = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Obtener horarios de un trabajador específico por mes y año
const getWorkerSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { workerId } = req.params;
    const { month, year } = req.query;

    const query = { worker: workerId };
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const schedules = await Schedule.find(query)
      .populate('worker', 'name')
      .populate('createdBy', 'name')
      .lean();

    console.log('Horarios del trabajador:', JSON.stringify(schedules, null, 2));

    if (!schedules.length) {
      return res.json({ worker: null, shifts: [] });
    }

    // Combinar todos los turnos en un solo objeto
    const combinedSchedule = {
      worker: schedules[0].worker,
      shifts: schedules.reduce((acc, schedule) => {
        const shifts = schedule.shifts.map(shift => ({
          ...shift,
          scheduleId: schedule._id
        }));
        return [...acc, ...shifts];
      }, [])
    };

    res.json(combinedSchedule);
  } catch (error) {
    console.error('Error al obtener horarios del trabajador:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un turno específico dentro de un horario
const updateShift = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { shiftId } = req.params;
    const { workerId, startTime, endTime, date } = req.body;

    const schedule = await Schedule.findOne({
      worker: workerId,
      'shifts._id': shiftId
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    const result = await Schedule.updateOne(
      { 'shifts._id': shiftId },
      {
        $set: {
          'shifts.$.startTime': startTime,
          'shifts.$.endTime': endTime,
          'shifts.$.date': date
        }
      },
      { runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No se pudo actualizar el turno' });
    }

    console.log('Turno actualizado:', { shiftId, startTime, endTime, date });
    res.json({ message: 'Turno actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el turno:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un turno específico de un horario
const deleteShift = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { shiftId } = req.params; // ID del turno
    const { workerId } = req.body; // ID del trabajador

    // Buscar el horario que contiene el turno
    const schedule = await Schedule.findOne({
      worker: workerId,
      'shifts._id': shiftId
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    // Eliminar el turno del array `shifts`
    const result = await Schedule.updateOne(
      { _id: schedule._id },
      {
        $pull: {
          shifts: { _id: shiftId }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar el turno' });
    }

    // Eliminar horarios que quedaron sin turnos
    await Schedule.deleteMany({
      worker: workerId,
      shifts: { $size: 0 }
    });

    console.log('Turno eliminado:', { shiftId, workerId });
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el turno:', error);
    res.status(500).json({ error: error.message });
  }
};

// Exportar todas las funciones del controlador
module.exports = {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  getWorkerSchedule,
  updateShift,
  deleteShift
};






