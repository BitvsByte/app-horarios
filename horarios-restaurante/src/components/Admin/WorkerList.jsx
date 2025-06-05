import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AiTwotoneEdit } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";

const WorkersList = ({ onWorkerSelect }) => {
  const [workers, setWorkers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', email: '', password: '', role: 'worker', contract: '' });
  const [editWorker, setEditWorker] = useState({ id: '', name: '', email: '', contract: '' });
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const workerUsers = data.filter(user => user.role === 'worker');
      setWorkers(workerUsers);
      setError(null);
    } catch (err) {
      setError('Error al cargar trabajadores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorker = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWorker)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear trabajador');
      }

      await fetchWorkers();
      setShowCreateModal(false);
      setNewWorker({ name: '', email: '', password: '', role: 'worker', contract: '' });
    } catch (error) {
      setError('Error al crear trabajador: ' + error.message);
    }
  };

  const handleEditWorker = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${editWorker.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editWorker.name, email: editWorker.email, contract: editWorker.contract })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al editar trabajador');
      }

      await fetchWorkers();
      setShowEditModal(false);
      setEditWorker({ id: '', name: '', email: '', contract: '' });
    } catch (error) {
      setError('Error al editar trabajador: ' + error.message);
    }
  };

  const handleDeleteWorker = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${workerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar trabajador');
      }

      await fetchWorkers();
      setShowDeleteModal(false);
      setSelectedWorker(null);
    } catch (error) {
      setError('Error al eliminar trabajador: ' + error.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Cargando trabajadores...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-2">
    {/* Botón para abrir el modal de creación */}
    <button
      onClick={() => setShowCreateModal(true)}
      className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
    >
      Crear Trabajador
    </button>

    {/* Lista de trabajadores */}
    {workers.length === 0 ? (
      <div className="text-center text-gray-500">No hay trabajadores disponibles</div>
    ) : (
      workers.map((worker) => (
        <div
          key={worker._id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col justify-between items-center">
            {/* Información del trabajador */}
            <div onClick={() => onWorkerSelect(worker)} className="cursor-pointer">
              <h3 className="font-medium">{worker.name}</h3>
              <p className="text-sm text-gray-600">{worker.email}</p>
            </div>

            {/* Botones de acción (editar y borrar) */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditWorker({
                    id: worker._id,
                    name: worker.name,
                    email: worker.email,
                    contract: worker.contract || '',
                  });
                  setShowEditModal(true);
                }}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <AiTwotoneEdit />
              </button>
              <button
                onClick={() => {
                  setSelectedWorker(worker);
                  setShowDeleteModal(true);
                }}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        </div>
      ))
    )}

    {/* Modal de Creación */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Crear Nuevo Trabajador</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newWorker.email}
                onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={newWorker.password}
                onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                value={newWorker.role}
                onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="worker">Trabajador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contrato</label>
              <input
                type="text"
                value={newWorker.contract}
                onChange={(e) => setNewWorker({ ...newWorker, contract: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Tipo de contrato"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateWorker}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Modal de Edición */}
    {showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Editar Trabajador</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={editWorker.name}
                onChange={(e) => setEditWorker({ ...editWorker, name: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editWorker.email}
                onChange={(e) => setEditWorker({ ...editWorker, email: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contrato</label>
              <input
                type="text"
                value={editWorker.contract}
                onChange={(e) => setEditWorker({ ...editWorker, contract: e.target.value })}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Tipo de contrato"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditWorker}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Modal de Confirmación de Borrado */}
    {showDeleteModal && selectedWorker && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
          <h3 className="text-xl font-bold mb-4">¿Eliminar Trabajador?</h3>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que quieres eliminar a {selectedWorker.name}? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteWorker(selectedWorker._id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

WorkersList.propTypes = {
  onWorkerSelect: PropTypes.func.isRequired
};

export default WorkersList;
