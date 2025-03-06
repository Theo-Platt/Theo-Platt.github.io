const express = require('express')
const app = express()
const path = require('path');
const port = 3500
const useLogSocketData = true


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
        let room = Array.from(socket.rooms)[1]
        sockmap[socket.id] = room
        if(hosts[room]==null || hosts[room]==undefined){
            hosts[room]=socket.id
            socket.emit('Host Notification')
        }else{
            socket.emit('Non-Host Notification')
        }
        socket.emit('Chatbox Message',{ str:`Joined room '${frag}'.` })
        
        
    })

    // When a user disconnects, remove them from their room and migrate hosts if needed.
    socket.on('closing', () => {
        delete sockmap[socket.id]
        let room = Array.from(socket.rooms)[1]
        let host = hosts[`${room}`]
        if(host==socket.id){
            if(!useLogSocketData) console.log(`\nMigrating Host for ${room}`)
            else console.logSocketData()
            delete hosts[room]
            io.to(`${room}`).emit('Host Migration')
        }
        else{
            io.to(host).emit('player disconnect', socket.id)
        }
        if(host!=null && host!=undefined){
            if(!useLogSocketData)console.log(`${socket.id} has disconnected from ${room}`)
            else console.logSocketData()
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
    })

    // Game Joining 
    socket.on('Join Game',(msg)=>{
        let room = Array.from(socket.rooms)[1]
        let host = hosts[`${room}`]
        io.to(host).emit('Join Game', socket.id)
        if(!useLogSocketData){
            if(socket.id == host)
                console.log(`Client '${socket.id}' joined ${room} as host`)
            else
                console.log(`Client '${socket.id}' joined ${room} hosted by '${hosts[room]}'`)    
        }else console.logSocketData()
        })

    
});

// Listen on the port
http.listen(port, () => {
    console.log(`Distributed-Multiplayer-Game Server Listening on port ${port}`)
})


//just having some fun messing with console stuff. not part of the game really
const blue = (x)=>{return `\x1b[34m${x}\x1b[0m`};
const green = (x)=>{return `\x1b[32m${x}\x1b[0m`};
const yellow = (x)=>{return `\x1b[33m${x}\x1b[0m`};
console.greenlog = (x)=>{if(x!=undefined){console.log(green(x))}else{console.log()}}
console.logSocketData = ()=>{
    console.clear()
    console.log(`Distributed Multiplayer Game`)
    console.greenlog(`Total clients: ${blue(Object.keys(sockmap).length)}`)
    console.greenlog(`Total rooms:   ${blue(Object.keys(hosts).length)}`)
    console.greenlog(``)
    for(const [room,host] of Object.entries(hosts)){
        let count = 0
        for(const [client,c_room] of Object.entries(sockmap))
            if(c_room==room)
                count++

        console.greenlog(`Room:      ${yellow(room)}`)
        console.greenlog(`| Host ID: ${blue(host)}`)
        console.greenlog(`| Clients: ${blue(count)}`)
        
        console.greenlog()
    }
}