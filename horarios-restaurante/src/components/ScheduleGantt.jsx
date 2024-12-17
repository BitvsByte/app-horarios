// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types'; // Importar PropTypes para validación de props
// import Scheduler, { Resource } from 'devextreme-react/scheduler';

// const ScheduleGantt = ({ selectedMonth, selectedYear }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const views = ['day', 'week', 'month']; // Vistas disponibles para el Scheduler

//   // Obtener los horarios desde el backend
//   const fetchSchedules = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `http://localhost:5000/api/schedules?month=${selectedMonth}&year=${selectedYear}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) throw new Error('Error al cargar horarios');

//       const schedules = await response.json();

//       console.log('Horarios cargados:', schedules); // Verificar datos en consola

//       // Mapear datos para el componente Scheduler
//       const mappedAppointments = schedules.map((schedule) =>
//         schedule.shifts.map((shift) => ({
//           text: schedule.worker.name, // Nombre del trabajador
//           startDate: new Date(shift.date + 'T' + shift.startTime), // Fecha y hora de inicio
//           endDate: new Date(shift.date + 'T' + shift.endTime), // Fecha y hora de fin
//           workerId: schedule.worker._id, // ID del trabajador para recursos
//         }))
//       ).flat();

//       setAppointments(mappedAppointments);

//       // Crear lista de trabajadores para los recursos
//       const workerData = schedules.map((schedule) => ({
//         id: schedule.worker._id,
//         text: schedule.worker.name,
//       }));
//       setWorkers(workerData);
//     } catch (error) {
//       console.error('Error al cargar horarios:', error.message);
//     }
//   };

//   // Actualizar datos cuando cambien el mes o el año
//   useEffect(() => {
//     fetchSchedules();
//   }, [selectedMonth, selectedYear]);

//   return (
//     <div>
//       <Scheduler
//         dataSource={appointments} // Datos de los turnos
//         views={views} // Vistas habilitadas
//         defaultCurrentView="day" // Vista inicial
//         defaultCurrentDate={new Date()} // Fecha inicial (hoy)
//         height={600} // Altura del componente
//         startDayHour={7} // Hora de inicio de la jornada
//         endDayHour={23} // Hora de fin de la jornada
//       >
//         <Resource
//           fieldExpr="workerId" // Campo para asociar turnos a trabajadores
//           dataSource={workers} // Lista de trabajadores
//           label="Trabajadores" // Etiqueta de los recursos
//         />
//       </Scheduler>
//     </div>
//   );
// };

// // Validación de props con PropTypes
// ScheduleGantt.propTypes = {
//   selectedMonth: PropTypes.number.isRequired, // El mes debe ser un número
//   selectedYear: PropTypes.number.isRequired, // El año debe ser un número
// };

// export default ScheduleGantt;

