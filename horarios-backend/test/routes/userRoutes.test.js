const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Asegúrate de que server.js exporta `app`, no el servidor

describe('User Routes API', () => {
  let token;

  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    await mongoose.connect(process.env.MONGODB_URI);

    // Aquí deberías crear un usuario admin en la base de datos si no existe
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    token = response.body.token; // Obtener el token después de iniciar sesión
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Cerrar la conexión con la base de datos
  });

  describe('GET /api/users', () => {
    it('debería devolver todos los usuarios para un administrador autenticado', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería devolver un usuario específico para un administrador autenticado', async () => {
      // Primero, crea un usuario para probar el GET
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          role: 'worker',
        });

      const userId = userResponse.body._id; // Obtener el ID del usuario creado

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 404) {
        expect(response.body.message).toBe('User not found');
      } else {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', userId);
      }
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debería actualizar un usuario si el usuario tiene rol admin', async () => {
      // Primero, crea un usuario para probar el PUT
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testupdate@example.com',
          password: 'password123',
          role: 'worker',
        });

      const userId = userResponse.body._id; // Obtener el ID del usuario creado

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Nombre Actualizado' });

      if (response.status === 404) {
        expect(response.body.message).toBe('User not found');
      } else {
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Nombre Actualizado');
      }
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debería eliminar un usuario si el usuario tiene rol admin', async () => {
      // Primero, crea un usuario para probar el DELETE
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Delete User',
          email: 'deleteuser@example.com',
          password: 'password123',
          role: 'worker',
        });

      const userId = userResponse.body._id; // Obtener el ID del usuario creado

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 404) {
        expect(response.body.message).toBe('User not found');
      } else {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
      }
    });
  });

});

