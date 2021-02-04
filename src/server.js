const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

const { sendMessage, sendLocation } = require('./utils/message');
const { addUser, removeUser, getUser, getRoom } = require('./utils/users');

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.on('join', (options, callback) => {
    const { err, user } = addUser({ id: socket.id, ...options });

    if (err) {
      return callback(err);
    }
    socket.join(user.room);
    socket.emit('message', sendMessage(user.userName, 'Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        sendMessage(user.userName, `${user.userName} has joined!`)
      ); //broadcasting to all users except user just joined

    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', sendMessage(user.userName, message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);
    const url = `https://google.com/maps?q=${coords.lat},${coords.long}`;

    io.to(user.room).emit('resendLocation', sendLocation(user.userName, url));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        sendMessage(user.userName, `${user.userName} has lefted`)
      );
    }
    //disconnect is bulit-in method so no need to set emit function on client-side
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
