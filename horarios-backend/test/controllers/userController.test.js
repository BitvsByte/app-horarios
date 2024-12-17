const { getProfile, getAllUsers, getUserById, updateUser, deleteUser } = require('../../src/controllers/userController');
const User = require('../../src/models/User');

// Mock del objeto Response de Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock del objeto Request de Express
const mockRequest = (data) => {
  return {
    ...data
  };
};

// Mock del objeto Next de Express
const mockNext = jest.fn();

describe('User Controller', () => {

  describe('getProfile', () => {
    it('debería devolver el perfil del usuario autenticado', () => {
      const req = mockRequest({ user: { id: '1', name: 'Test User' } });
      const res = mockResponse();

      getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Test User' });
    });
  });

  describe('getAllUsers', () => {
    it('debería devolver una lista de usuarios', async () => {
      const req = mockRequest();
      const res = mockResponse();

      // Mock de la respuesta del modelo User.find()
      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }])
      });

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'Test User' }]);
    });
  });

  describe('getUserById', () => {
    it('debería devolver un usuario si se proporciona un ID válido', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse();

      // Mock del modelo User.findById()
      User.findById = jest.fn().mockResolvedValue({ id: '1', name: 'Test User' });

      await getUserById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Test User' });
    });

    it('debería devolver 400 si el ID proporcionado no es un ObjectId válido', async () => {
      const req = mockRequest({ params: { id: 'invalid-id' } });
      const res = mockResponse();

      await getUserById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Array) }));
    });

    it('debería llamar a next con un error si el usuario no es encontrado', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse();

      // Mock del modelo User.findById() para que devuelva null
      User.findById = jest.fn().mockResolvedValue(null);

      await getUserById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario si se proporciona un ID válido y datos válidos', async () => {
      const req = mockRequest({
        params: { id: '1' },
        body: { name: 'Nombre Actualizado' }
      });
      const res = mockResponse();

      // Mock del modelo User.findByIdAndUpdate()
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({ id: '1', name: 'Nombre Actualizado' });

      await updateUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Nombre Actualizado' });
    });

    it('debería devolver 404 si el usuario a actualizar no es encontrado', async () => {
      const req = mockRequest({
        params: { id: '1' },
        body: { name: 'Nombre Actualizado' }
      });
      const res = mockResponse();

      // Mock del modelo User.findByIdAndUpdate() para devolver null
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario si se proporciona un ID válido', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse();

      // Mock del modelo User.findByIdAndDelete()
      User.findByIdAndDelete = jest.fn().mockResolvedValue({ id: '1', name: 'Test User' });

      await deleteUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('debería devolver 404 si el usuario a eliminar no es encontrado', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse();

      // Mock del modelo User.findByIdAndDelete() para devolver null
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

});


