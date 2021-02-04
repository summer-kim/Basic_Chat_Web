const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

const { sendMessage } = require('./message');
app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.on('join', ({ userName, room }) => {
    socket.join(room);
    console.log(userName);
    socket.emit('message', sendMessage('Welcome!'));
    socket.broadcast
      .to(room)
      .emit('message', sendMessage(`${userName} has joined!`)); //broadcasting to all users except user just joined

    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
  });

  socket.on('sendMessage', (message, callback) => {
    io.emit('message', sendMessage(message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit('resendLocation', coords);
    callback();
  });

  socket.on('disconnect', () => {
    //disconnect is bulit-in method so no need to set emit function on client-side
    io.emit('message', sendMessage('A user has lefted'));
  });
});
// Send Counter project

//let count = 0;
// io.on('connection', (socket) => {
//     socket.emit('countUpdated', count);
//     count++;
//     socket.on('increment', () => {
//       //socket.emit() is just updating single client connected
//       io.emit('countUpdated', count);
//   });
// })

server.listen(PORT, () => {
  console.log('Server is up on ' + PORT);
});
