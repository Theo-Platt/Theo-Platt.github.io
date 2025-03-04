// Socket handler for when the server emits a message to all clients
socket.on('Chatbox Message',function(msg){
    console.log(msg)
    let text
    if(msg.usr!=undefined){
        text = `${msg.usr} : ${msg.str}`
    }else{
        text = `Server : ${msg.str}`
    }

    print_gamelog(text)

});


// Socket handler for when the server messages the client directly
socket.on('Server Message', (msg)=>{
    if(socket.id == msg.id){
        print_gamelog(`Server : ${msg.content}`)
        if(msg.emit != null)
            emitMessage(msg.emit.message,msg.emit.sender,true)
    }        
})


// Emits a message telling all clients to do print_gamelog()
function emitMessage(str, usr, broadcast){
    let msg = {"usr":usr,"str":str}
    if(broadcast!=undefined)
        socket.emit('Chatbox Message-b',msg)
    else    
        socket.emit('Chatbox Message',msg)
}


//Takes in text, prints it to the chatlog
function print_gamelog(text){
    //We want all player references to be their color in the textbox.
    
    let player_names = []
    // for(const player of Object.values(players)){
    //     if(player!=null){
    //         player_names.push(player.name)
    //     }
    // }
    
    info = document.createElement("li")
    info.classList.toggle(`logItem`,true)
    
    let newText=[]
    text.split(" ").forEach(token =>{
        let span = document.createElement('span')
        span.innerHTML = `${token} `
        switch (token){
            case "Player1":
                span.style.color='blue'
                break;

            case "Player2":
                span.style.color='red'
                break;

            case "Player3":
                span.style.color='green'
                break;

            case "Player4":
                span.style.color='darkgoldenrod'
                break;
            case "Spectator":
                span.style.color='darkgrey'
            default:
        }
        info.appendChild(span)
    });

    
    gameLog = document.getElementById("gameLog")
    gameLog.insertBefore(info, gameLog.firstChild);
}