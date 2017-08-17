// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


// Middleware
// app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
http.listen(8080, "127.0.0.1");

// Setup logger
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

// *****  Socket

let drawData = [];

io.on('connection', function (socket) {
    console.log("New user connected", socket.id);
    
    socket.on('connected', (data) => {
        socket.broadcast.emit('user connected', data.name);    
        console.log("Connected", data, socket.id);
        // console.log("DrawData",drawData);
        socket.emit('get canvas', drawData);
    });

	socket.on('draw', (data) => {
        drawData.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('erase board', (data)=>{
        console.log("Erasing Board");
        drawData = [];
        socket.broadcast.emit('erase board');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    socket.on('room', (data) => {
        socket.join(data.room);
    });

    socket.on('leave room', (data) => {
        socket.leave(data.room)
      })
});

module.exports = app;