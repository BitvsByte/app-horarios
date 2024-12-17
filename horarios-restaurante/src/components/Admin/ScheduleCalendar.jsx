import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useGeolocation } from '../../hook/useGeolocation';
import { FaRegTrashAlt } from 'react-icons/fa';
import { AiTwotoneEdit } from 'react-icons/ai';

function ScheduleCalendar({ selectedMonth, selectedYear, selectedWorker, isWorkerView = false }) {
  const [schedule, setSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClockModal, setShowClockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [newShift, setNewShift] = useState({
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isWithinRange } = useGeolocation();

  const daysOfWeek = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
  ];

  useEffect(() => {
    if (selectedWorker) {
      loadSchedule();
    }
  }, [selectedWorker, selectedMonth, selectedYear]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(
        `http://localhost:5000/api/schedules/worker/${selectedWorker._id}`, 
        {
          params: {
            month: selectedMonth,
            year: selectedYear
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSchedule(response.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setError(error.response?.data?.message || 'Error al cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMultipleShifts = async () => {
    if (!selectedWorker || !selectedDays.length) {
      alert('Por favor, seleccione al menos un día');
      return;
    }

    if (!newShift.startTime || !newShift.endTime) {
      alert('Por favor, complete los horarios de inicio y fin');
      return;
    }

    try {
      setLoading(true);
      const baseDate = new Date(selectedDate);
      const currentDayOfWeek = baseDate.getDay();
      
      const shifts = selectedDays.map(dayNumber => {
        const date = new Date(baseDate);
      
        // Ajustar los índices de los días: convertir de [1-7] a [0-6]
        const adjustedDayNumber = (dayNumber - 1) % 7;
      
        const diff = adjustedDayNumber - currentDayOfWeek;
        date.setDate(date.getDate() + diff);
      
        return {
          date,
          startTime: newShift.startTime,
          endTime: newShift.endTime
        };
      });
      

      const shiftData = {
        worker: selectedWorker._id,
        month: selectedMonth,
        year: selectedYear,
        shifts
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/schedules', shiftData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await loadSchedule();
      setShowModal(false);
      setNewShift({ startTime: '', endTime: '' });
      setSelectedDays([]);
      alert('Horarios creados correctamente');
    } catch (error) {
      console.error('Error al crear horarios:', error);
      alert(error.response?.data?.message || 'Error al crear los horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEditShift = async (shiftId) => {
    if (!newShift.startTime || !newShift.endTime) {
      alert('Por favor, complete los horarios de inicio y fin');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const updatedData = {
        workerId: selectedWorker._id,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        date: selectedShift.date
      };

      await axios.put(
        `http://localhost:5000/api/schedules/shift/${shiftId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      await loadSchedule();
      setShowEditModal(false);
      setNewShift({ startTime: '', endTime: '' });
      setSelectedShift(null);
      alert('Horario actualizado correctamente');
    } catch (error) {
      console.error('Error al editar horario:', error);
      alert(error.response?.data?.message || 'Error al editar el horario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este turno?');
      if (!confirmDelete) return;
  
      setLoading(true);
      const token = localStorage.getItem('token');
  
      await axios.delete(
        `http://localhost:5000/api/schedules/shift/${shiftId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: {
            workerId: selectedWorker._id
          }
        }
      );
  
      await loadSchedule();
      alert('Turno eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      alert(error.response?.data?.message || 'Error al eliminar el turno');
    } finally {
      setLoading(false);
    }
  };
  

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/attendance/clock-in',
        {
          workerId: selectedWorker._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setShowClockModal(false);
      alert('Entrada registrada correctamente');
    } catch (error) {
      console.error('Error al registrar entrada:', error);
      alert(error.response?.data?.message || 'Error al registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/attendance/clock-out',
        {
          workerId: selectedWorker._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setShowClockModal(false);
      alert('Salida registrada correctamente');
    } catch (error) {
      console.error('Error al registrar salida:', error);
      alert(error.response?.data?.message || 'Error al registrar salida');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={loadSchedule}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {selectedWorker ? (
        <>
          {/* Cabecera de días - Solo visible en desktop */}
          <div className="hidden md:grid md:grid-cols-7 gap-1 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="p-2 text-center font-bold bg-gray-100 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Vista móvil - Lista vertical */}
          <div className="block md:hidden space-y-2">
            {Array.from({ length: daysInMonth }).map((_, index) => (
              <div 
                key={index} 
                className="border rounded-lg shadow-sm p-3"
                onClick={() => {
                  if (!isWorkerView) {
                    setSelectedDate(new Date(selectedYear, selectedMonth - 1, index + 1));
                    setShowModal(true);
                  }
                }}
              >
                <div className="font-semibold mb-2">
                  {new Date(selectedYear, selectedMonth - 1, index + 1).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric'
                  })}
                </div>
                {schedule?.shifts?.filter(shift => {
                  const shiftDate = new Date(shift.date);
                  return shiftDate.getDate() === index + 1;
                }).map((shift, shiftIndex) => (
                  <div key={shiftIndex} className="bg-blue-100 p-2 rounded text-sm flex justify-between items-center mb-1">
                    <span>{shift.startTime} - {shift.endTime}</span>
                    {!isWorkerView && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShift(shift);
                            setNewShift({
                              startTime: shift.startTime,
                              endTime: shift.endTime
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <AiTwotoneEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShift(shift._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isWorkerView && (
                  <div className="mt-2">
                    <button
                      disabled={!isWithinRange || loading}
                      onClick={() => setShowClockModal(true)}
                      className={`w-full px-4 py-2 rounded text-white ${
                        isWithinRange && !loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Fichar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vista desktop - Grid de calendario */}
          <div className="hidden md:grid md:grid-cols-7 gap-1">
            {Array.from({ length: daysInMonth }).map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  if (!isWorkerView && !loading) {
                    setSelectedDate(new Date(selectedYear, selectedMonth - 1, index + 1));
                    setShowModal(true);
                  }
                }}
                className={`p-2 border min-h-[100px] relative ${!isWorkerView && !loading ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              >
                <span className="absolute top-1 left-1">{index + 1}</span>
                {schedule?.shifts?.filter(shift => {
                  const shiftDate = new Date(shift.date);
                  return shiftDate.getDate() === index + 1;
                }).map((shift, shiftIndex) => (
                  <div key={shiftIndex} className="mt-6 text-sm bg-blue-100 p-1 rounded flex flex-col justify-between items-center mb-1">
                    <span>{shift.startTime} - {shift.endTime}</span>
                    {!isWorkerView && (
                      <div className="flex space-x-2">
                        <button
                          disabled={loading}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShift(shift);
                            setNewShift({
                              startTime: shift.startTime,
                              endTime: shift.endTime
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <AiTwotoneEdit />
                        </button>
                        <button
                          disabled={loading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShift(shift._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isWorkerView && (
                  <div className="mt-2">
                    <button
                      disabled={!isWithinRange || loading}
                      onClick={() => setShowClockModal(true)}
                      className={`w-full px-4 py-2 rounded text-white ${
                        isWithinRange && !loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Fichar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          {isWorkerView ? "Cargando horario..." : "Selecciona un trabajador para ver/editar sus horarios"}
        </div>
      )}
      {/* Modal para añadir/editar horarios */}
      {!isWorkerView && (showModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4">
                {showEditModal ? 'Editar Horario' : `Añadir Horarios - ${selectedDate?.toLocaleDateString()}`}
              </h3>
              <div className="space-y-4">
                {!showEditModal && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Seleccionar días</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            setSelectedDays(prev => 
                              prev.includes(day.value) 
                                ? prev.filter(d => d !== day.value)
                                : [...prev, day.value]
                            );
                          }}
                          className={`p-2 rounded text-sm ${
                            selectedDays.includes(day.value) 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hora de inicio</label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                    className="w-full border rounded-md p-2"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hora de fin</label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                    className="w-full border rounded-md p-2"
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setShowModal(false);
                      setShowEditModal(false);
                      setSelectedDays([]);
                      setNewShift({ startTime: '', endTime: '' });
                    }}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={showEditModal ? 
                      () => handleEditShift(selectedShift._id) : 
                      handleAddMultipleShifts
                    }
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : (showEditModal ? 'Guardar cambios' : 'Guardar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Fichaje */}
      {showClockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center">Registro de Jornada</h3>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleClockIn}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Entrada'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleClockOut}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Salida'}
                </button>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowClockModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ScheduleCalendar.propTypes = {
  selectedMonth: PropTypes.number.isRequired,
  selectedYear: PropTypes.number.isRequired,
  selectedWorker: PropTypes.object,
  isWorkerView: PropTypes.bool
};

export default ScheduleCalendar;