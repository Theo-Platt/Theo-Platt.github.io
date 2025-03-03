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

app.get('/Host',(req,res) =>{
    res.sendFile(require('./Host/Snek.js'))
    res.sendFile(require('./Host/GameBoard.js'))
    res.sendFile(require('./Host/HostScript.js'))
    res.end()
})


var http = require('http').createServer(app);
var io = require('socket.io')(http);


// Handle socket stuff
let host = null
let connected = {}
io.on('connection', (socket) => {

    //What to do when first connecting
    console.log('a user connected');
    if(host==null){
        host = socket.id
    }
    if(host==socket.id){
        socket.emit('Host Notification')
    }
    let msg={
        usr:undefined,
        msg:"Connected.",
        usr:socket
    }
    // socket.emit('update chatlog')
    socket.emit('update chatlog',msg)

    //extra stuff
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

// Listen on the port
http.listen(port, () => {
    console.log(`Distributed-Multiplayer-Game Server Listening on port ${port}`)
})