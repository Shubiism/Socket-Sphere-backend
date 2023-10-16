// Node server which will handle socket.io connections
const express = require('express');
//const portfinder = require('portfinder');
const app = express();
const http = require('http').createServer(app); // Create an HTTP server

// Use portfinder to find an available port
//portfinder.getPort((err, server) => {
//    if (err) {
//        console.error('Error finding an available port:', err);
//     return;
// }

http.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
});

// Rest of your code for socket.io should use the 'http' server
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

