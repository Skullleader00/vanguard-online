const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3001;

let rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = { players: [] };
    rooms[roomId].players.push(socket.id);
    io.to(roomId).emit('room_update', rooms[roomId].players);
  });

  socket.on('draw_card', ({ roomId, playerId }) => {
    const card = {
      name: 'Blaster Blade',
      power: 10000,
      grade: 2,
    };
    io.to(roomId).emit('card_drawn', { playerId, card });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter((id) => id !== socket.id);
      io.to(roomId).emit('room_update', rooms[roomId].players);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
