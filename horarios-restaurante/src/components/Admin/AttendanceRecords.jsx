import { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AttendanceRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    worker: '',
    date: '',
    type: '',
    time: '',
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/attendance/records');
        setRecords(response.data);
        setFilteredRecords(response.data);
        setError(null);
      } catch (error) {
        console.error('Error al obtener registros:', error);
        setError('Error al cargar los registros');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter((record) => {
      // Validar que record y record.worker existan y tengan las propiedades necesarias
      if (!record || !record.worker || !record.worker.name) {
        return false;
      }

      const workerMatch = record.worker.name
        .toLowerCase()
        .includes(filters.worker.toLowerCase());
      const dateMatch = record.date ? new Date(record.date)
        .toLocaleDateString()
        .includes(filters.date) : false;
      const typeMatch = record.type ? 
        record.type.toLowerCase().includes(filters.type.toLowerCase()) : false;
      const timeMatch = record.time ? 
        record.time.includes(filters.time) : false;

      return workerMatch && dateMatch && typeMatch && timeMatch;
    });

    setFilteredRecords(filtered);
  }, [filters, records]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const downloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Registros');

    sheet.columns = [
      { header: 'Trabajador', key: 'worker', width: 20 },
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Tipo', key: 'type', width: 10 },
      { header: 'Hora', key: 'time', width: 10 },
    ];

    filteredRecords.forEach((record) => {
      if (record && record.worker) {
        sheet.addRow({
          worker: record.worker.name || 'N/A',
          date: record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
          type: record.type || 'N/A',
          time: record.time || 'N/A',
        });
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'attendance_records.xlsx');
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Registro de Entradas/Salidas', 10, 10);

    const tableData = filteredRecords
      .filter(record => record && record.worker)
      .map((record) => [
        record.worker.name || 'N/A',
        record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
        record.type || 'N/A',
        record.time || 'N/A',
      ]);

    doc.autoTable({
      head: [['Trabajador', 'Fecha', 'Tipo', 'Hora']],
      body: tableData,
    });

    doc.save('attendance_records.pdf');
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-center py-4">Cargando registros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Registro de Entradas/Salidas</h2>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={downloadExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Descargar Excel
        </button>
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Descargar PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">
                Trabajador
                <input
                  type="text"
                  name="worker"
                  value={filters.worker}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-2 py-1 border rounded"
                  placeholder="Filtrar"
                />
              </th>
              <th className="px-4 py-2">
                Fecha
                <input
                  type="text"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-2 py-1 border rounded"
                  placeholder="dd/mm/yyyy"
                />
              </th>
              <th className="px-4 py-2">
                Tipo
                <input
                  type="text"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-2 py-1 border rounded"
                  placeholder="entrada/salida"
                />
              </th>
              <th className="px-4 py-2">
                Hora
                <input
                  type="text"
                  name="time"
                  value={filters.time}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full px-2 py-1 border rounded"
                  placeholder="Filtrar"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => {
              if (!record || !record.worker) return null;
              
              return (
                <tr key={record._id} className="border-b">
                  <td className="px-4 py-2">{record.worker.name}</td>
                  <td className="px-4 py-2">
                    {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        record.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {record.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{record.time || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRecords;