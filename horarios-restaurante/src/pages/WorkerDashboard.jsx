// WorkerDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ScheduleCalendar from '../components/Admin/ScheduleCalendar';

const WorkerDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    console.log('User data:', user); // Añadir este log para verificar
    if (user && user.id) {
      // Asegurarse de que existe user.id antes de pasarlo al ScheduleCalendar
      setSelectedWorker({
        _id: user.id,
        name: user.name
      });
    }
  }, [user]);

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/api/messages', {
        content: message,
        from: user.id,
        to: '6751e0b8716a7b29158407e4'
      });
      setMessage('');
      alert('Mensaje enviado correctamente');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Panel de Horarios */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Mi Horario</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full sm:w-auto border p-2 rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full sm:w-auto border p-2 rounded"
                >
                  {[2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <ScheduleCalendar
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedWorker={selectedWorker}
                isWorkerView={true}
              />
            </div>
          </div>

          {/* Panel de Mensajes */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Enviar Mensaje</h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows="4"
                placeholder="Escribe tu mensaje..."
              />
              <button
                onClick={sendMessage}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;