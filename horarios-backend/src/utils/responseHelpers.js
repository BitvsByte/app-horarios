// Manejo de respuestas exitosas
const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// Manejo de errores
const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({ error: error.message });
};

module.exports = {
  handleSuccess,
  handleError
};

