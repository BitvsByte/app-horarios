import { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);  // Inicializar como array vacío
  const [loading, setLoading] = useState(true);    // Añadir estado de carga
  const [error, setError] = useState(null);        // Añadir estado de error

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/schedules');
        setSchedules(Array.isArray(res.data) ? res.data : []);  // Asegurar que es un array
        setError(null);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setError('Error al cargar los horarios');
        setSchedules([]);  // En caso de error, establecer array vacío
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Gestión de Horarios</h2>
      {/* Resto del código... */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="w-1/4 px-4 py-2">Trabajador</th>
            <th className="w-1/4 px-4 py-2">Mes</th>
            <th className="w-1/4 px-4 py-2">Año</th>
            <th className="w-1/4 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule._id}>
              <td className="border px-4 py-2">{schedule.worker?.name || 'N/A'}</td>
              <td className="border px-4 py-2">{schedule.month}</td>
              <td className="border px-4 py-2">{schedule.year}</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  Editar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleManagement;