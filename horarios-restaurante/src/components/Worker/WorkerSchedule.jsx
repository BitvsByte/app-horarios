// components/Worker/WorkerSchedule.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const WorkerSchedule = () => {
 const [setSchedules] = useState([]);
 const [message, setMessage] = useState('');
 const [view, setView] = useState('monthly');

 useEffect(() => {
   fetchSchedules();
 }, []);

 const fetchSchedules = async () => {
   try {
     const response = await axios.get('/api/schedules/my-schedules');
     setSchedules(response.data);
   } catch (error) {
     console.error('Error:', error);
   }
 };

 const sendMessage = async () => {
   try {
     await axios.post('/api/messages', {
       content: message,
       to: 'admin' // ID del admin
     });
     setMessage('');
   } catch (error) {
     console.error('Error:', error);
   }
 };

 return (
   <div className="p-6">
     <div className="mb-6">
       <div className="flex gap-4 mb-4">
         <button 
           onClick={() => setView('monthly')}
           className={`px-4 py-2 rounded ${view === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
         >
           Vista Mensual
         </button>
         <button
           onClick={() => setView('yearly')}
           className={`px-4 py-2 rounded ${view === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
         >
           Vista Anual
         </button>
       </div>

       {view === 'monthly' ? (
         <div className="grid grid-cols-7 gap-2">
           {/* Renderizar calendario mensual */}
         </div>
       ) : (
         <div className="grid grid-cols-3 gap-4">
           {/* Renderizar vista anual */}
         </div>
       )}
     </div>

     <div className="mt-8">
       <h3 className="text-lg font-bold mb-4">Enviar Mensaje al Admin</h3>
       <textarea
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         className="w-full p-2 border rounded mb-2"
         rows="4"
         placeholder="Escribe tu mensaje..."
       />
       <button
         onClick={sendMessage}
         className="bg-blue-500 text-white px-4 py-2 rounded"
       >
         Enviar Mensaje
       </button>
     </div>
   </div>
 );
};

export default WorkerSchedule;
