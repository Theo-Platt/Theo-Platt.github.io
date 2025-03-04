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
let hosts = {}
let sockmap = {}
io.on('connection', (socket) => {
    
    // When a user connects, assign them a room and make them host if needed.
    socket.emit('request fragment')
    socket.on('request fragment',(frag)=>{
        socket.join(`#${frag}`)
        if(hosts[`#${frag}`]==null){
            hosts[`#${frag}`]=socket.id
            socket.emit('Host Notification')
            console.log(hosts)
        }else{
            socket.emit('Non-Host Notification')
        }
        socket.emit('Chatbox Message',{ str:`Joined room '${frag}'.` })
        console.log(socket.id + " connected to "+Array.from(socket.rooms)[1])
    })

    // When a user disconnects, remove them from their room and migrate hosts if needed.
    socket.on('disconnecting', () => {

        let room = Array.from(socket.rooms)[1]
        let host = hosts[`${room}`]
        if(host==socket.id){
            console.log(`Migrating Host for ${room}`)
            hosts[room]=null
            io.to(`#${room}`).emit('Host Migration')
        }
        else{
            console.log(`${socket.id} has disconnected from ${room}`)
            io.to(host).emit('player disconnect', socket.id)
        }
    });


    

    // Chat
    socket.on('Chatbox Message',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        io.to(room).emit('Chatbox Message',msg)
    })
    socket.on('Chatbox Message-b',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        socket.broadcast.to(room).emit('Chatbox Message',msg)
    })

    socket.on('Server Message',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        io.to(room).emit('Server Message', msg)
    })

    // Graphics
    socket.on('GameLoop',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        io.to(room).emit('GameLoop', msg)
    })

    // Controls
    socket.on('input',(msg)=>{
        newmsg = {
            id:socket.id,
            dir:msg
        }
        let room = Array.from(socket.rooms)[1]
        let host = hosts[`${room}`]
        io.to(host).emit('input', newmsg)
        console.log(`${newmsg} in room ${room} hosted by ${host}`)
    })

    // Game Joining 
    socket.on('Join Game',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        let host = hosts[`${room}`]
        io.to(host).emit('Join Game', socket.id)
        console.log(`${socket.id} joined ${room} hosted by ${host}`)
    })

    
});

// Listen on the port
http.listen(port, () => {
    console.log(`Distributed-Multiplayer-Game Server Listening on port ${port}`)
})