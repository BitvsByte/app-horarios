module.exports = {
  testEnvironment: 'node', // Necesitamos el entorno de 'node' para probar nuestra API
  testTimeout: 10000,      // Tiempo límite para cada prueba (en milisegundos)
  coverageDirectory: './coverage', // Directorio donde se generará el reporte de cobertura
  collectCoverage: true,           // Recolección de la cobertura para el análisis
};
