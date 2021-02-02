const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));

let count = 0;
io.on('connection', (socket) => {
  socket.emit('countUpdated', count);
  socket.on('increment', () => {
    count++;
    //socket.emit() is just updating single client connected
    io.emit('countUpdated', count);
  });
});

server.listen(PORT, () => {
  console.log('Server is up on ' + PORT);
});
