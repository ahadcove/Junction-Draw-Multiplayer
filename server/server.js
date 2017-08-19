// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Init App
const app = express();

// Socket Setup
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Middleware
// app.use(cors());
// app.use(cors({credentials: true, origin: 'https://localhost:3000'}));
http.listen(process.env.PORT || 9000, "127.0.0.1");
// http.listen(8080, "127.0.0.1");

// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Setup logger
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

let db = {
    board:[],
    users:[]
};

// ***** Socket
io.on('connection', function (socket) {
    
    socket.on('connected', (data) => {
        console.log("New user connected", data.name, socket.id );
        db.users.push({id:socket.id, name:data.name});
        socket.emit('get canvas', db);
        socket.broadcast.emit('user connected', db.users);    
    });

    socket.on("resized",()=>{
        socket.emit("resized", db.board);
    })

	socket.on('draw', (data) => {
        db.board.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('erase board', (data)=>{
        console.log("Erasing Board");
        db.board = [];
        socket.broadcast.emit('erase board');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        for(let i = 0; i<db.users.length; i++){
            if(db.users[i].id === socket.id){
                db.users.splice(i, 1);
                socket.broadcast.emit("user left", db.users);
                break;
            }
            // db.users.push({id:socket.id, name:socket.name});
        }
    });
    
    socket.on('room', (data) => {
        socket.join(data.room);
    });

    socket.on('leave room', (data) => {
        socket.leave(data.room)
    })
});

module.exports = app;