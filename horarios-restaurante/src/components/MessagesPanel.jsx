import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaRegTrashAlt } from 'react-icons/fa';

const MessagesPanel = ({ className }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:5001/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar los mensajes');
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los mensajes: ' + err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`http://localhost:5001/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el mensaje');
      }

      // Actualizar la lista de mensajes
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      setShowDeleteModal(false);
      setSelectedMessage(null);
      setError(null);
    } catch (err) {
      setError('Error al eliminar el mensaje: ' + err.message);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchMessages();
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center p-4`}>
        <div className="text-gray-600">Cargando mensajes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-4`}>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Mensajes</h2>
      
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No hay mensajes disponibles
        </div>
      ) : (
        messages.map(message => (
          <div 
            key={message._id} 
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="font-bold">
                  {message.from?.name || 'Usuario Desconocido'}
                </p>
                <p className="break-words text-gray-700 mt-1">
                  {message.content}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedMessage(message);
                  setShowDeleteModal(true);
                }}
                className="ml-4 px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Eliminar mensaje"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal de Confirmación de Borrado */}
      {showDeleteModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
            <h3 className="text-xl font-bold mb-4">¿Eliminar mensaje?</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMessage(null);
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteMessage(selectedMessage._id)}
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

MessagesPanel.propTypes = {
  className: PropTypes.string
};

MessagesPanel.defaultProps = {
  className: ''
};

export default MessagesPanel;