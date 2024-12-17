import { useState } from 'react';
import axios from 'axios';

const Chatbox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    try {
      const res = await axios.post('/api/messages', { content: message });
      setMessages([...messages, res.data]);
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold">Chat con Administrador</h2>
      <div className="border p-4 h-64 overflow-y-scroll">
        {messages.map((msg) => (
          <div key={msg._id} className="my-2">
            <span className="font-bold">{msg.from.name}: </span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje"
        className="border w-full px-4 py-2 mt-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Enviar
      </button>
    </div>
  );
};

export default Chatbox;
