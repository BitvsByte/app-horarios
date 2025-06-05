require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const userRoutes = require('./src/routes/userRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

// Configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);

// Manejo de errores global
app.use(errorHandler);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Asegúrate que tu .env tenga MONGO_URI
    console.log('MongoDB conectado exitosamente');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

// Iniciar servidor (excepto en entorno de test)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5001;

    const server = app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    });

    // Capturar errores no manejados
    process.on('unhandledRejection', (err) => {
      console.error('Error no manejado:', err);
      server.close(() => process.exit(1));
    });
  });
}

// Exportar app para testing
module.exports = app;
