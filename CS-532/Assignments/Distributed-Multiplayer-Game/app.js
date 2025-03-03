const express = require('express')
const app = express()
const path = require('path');
const port = 3000


//middleware
app.use(express.static(path.join(__dirname, 'Client')));

// get /
app.get('/', (req, res) => {
    res.sendFile(require('./client/index.html'))
    res.end()
})

var http = require('http').createServer(app);
var io = require('socket.io')(http);


// Handle socket stuff
let host = null
let connected = {}
io.on('connection', (socket) => {

    //What to do when first connecting
    console.log(`a user connected with ID: ${socket.id}`);
    if(host==null){
        console.log(`New Host: ${socket.id}`)
        host = socket.id
    }
    if(host==socket.id){
        socket.emit('Host Notification')
    }
    let msg={
        usr:undefined,
        str:"Connected.",
        sock:socket.id
    }
    // socket.emit('update chatlog')
    socket.emit('update chatlog',msg)

    //extra stuff
    socket.on('disconnect', () => {
        if(host==socket.id)
            host=null
      console.log(`user disconnected: ${socket.id}`);
    });
});

// Listen on the port
http.listen(port, () => {
    console.log(`Distributed-Multiplayer-Game Server Listening on port ${port}`)
})