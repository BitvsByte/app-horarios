const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`); // Imprimir el error en la consola para depuración

  // Enviar la respuesta con el error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;

