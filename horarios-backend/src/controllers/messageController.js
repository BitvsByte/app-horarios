// controllers/messageController.js
const Message = require('../models/Message');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const message = await Message.create(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [{ to: req.user.id }, { from: req.user.id }]
      }).populate('from to', 'name');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
      
      if (!message) {
        return res.status(404).json({ message: 'Mensaje no encontrado' });
      }
      
      // Verificar que el usuario sea el remitente o el destinatario
      if (message.from.toString() !== req.user.id && message.to.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No autorizado para borrar este mensaje' });
      }
      
      await Message.findByIdAndDelete(req.params.id);
      res.json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = messageController;