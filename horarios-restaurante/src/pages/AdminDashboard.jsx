// pages/AdminDashboard.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import WorkersList from '../components/Admin/WorkerList';
import ScheduleCalendar from '../components/Admin/ScheduleCalendar';
import AttendanceRecords from '../components/Admin/AttendanceRecords';
import MessagesPanel from '../components/MessagesPanel';
import UsersTable from '../components/Admin/UserTable';
// import ScheduleGantt from '../components/ScheduleGantt';

function AdminDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWorker, setSelectedWorker] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Panel de Trabajadores */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Trabajadores</h2>
              <WorkersList onWorkerSelect={setSelectedWorker} />
            </div>
          </div>
          

          {/* Panel de Horarios */}
         {/* Panel de Horarios */}
            <div className="md:col-span-7">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">Horarios</h2>
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
                />
              </div>

              {/* Gráfico Gantt */}
              {/* <div className="bg-white rounded-lg shadow p-4 mt-4">
                <h2 className="text-xl font-bold mb-4">Vista Gantt</h2>
                <ScheduleGantt selectedMonth={selectedMonth} selectedYear={selectedYear} />
              </div> */}
            </div>


          {/* Panel de Mensajes */}
          <div className="md:col-span-3">
            <MessagesPanel /> 
          </div>

          {/* Panel de Registro de Entradas/Salidas */}
          <div className="md:col-span-12">
            <div className="bg-white rounded-lg shadow p-4">
              <AttendanceRecords />
            </div>
          </div>
          {/* Panel de Usuarios */}
          <div className="md:col-span-12">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
              <UsersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

