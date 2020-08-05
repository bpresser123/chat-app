const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New connection')

  socket.on('join', ({ name, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room });

    if(error) {
      return callback(error);
    }

    socket.emit('message', { user: 'admin', text: `${user.name} welcome to the ${user.room} room`})
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the ${user.room} room`})

    socket.join(user.room)

    callback();
  })

  socket.on('disconnect', () => {
    console.log('User left')
  })
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))