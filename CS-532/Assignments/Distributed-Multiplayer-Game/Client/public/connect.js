socket.on('request fragment',()=>{
    frag = 'default'
    if(window.location.hash) {
        frag = window.location.hash.substring(1);
    }
    console.log('frag sent:'+frag)
    socket.emit('request fragment', frag)
})

socket.on('Host Migration',()=>{
    console.log("Migrating Host")
    window.location.reload(true);
})


socket.on('Server Message', (msg)=>{
    if(socket.id == msg.id){
        print_gamelog(`Server : ${msg.content}`)
        if(msg.emit != null)
            emitMessage(msg.emit.message,msg.emit.sender,true)
        if(msg.role != undefined){
            role = msg.role
            enableKeyboardListener()
        }
    }        
})


window.addEventListener("beforeunload",()=>{
    socket.emit('closing')
})


socket.on('Host Notification',async function(){
    console.log("I am the host.")
    Assigned_Host_Role()
    document.getElementById('startButton').onclick = gamesetup
    socket.emit('Join Game',{id:null,name:null})
})

socket.on('Non-Host Notification',async function(){
    console.log("I am not the host.")
    document.getElementById('startButton').classList.add('hidden',true)
    socket.emit('Join Game',{id:null,name:null})
})

// creates the table on load
function onload(){
    const tabletop_holder = document.getElementById("tableHolder");
    const tabletop = document.createElement(`table`);
    tabletop_holder.appendChild(tabletop)

    //create game board and accompanying data matrix

    for(let row = 0; row < numRows ; row++){
        const thisRow = document.createElement(`tr`);
        tabletop.appendChild(thisRow)

        for(let col = 0; col < numCols ; col++){
            //modify DIM
            const thisCol = document.createElement(`td`);
            const div = document.createElement(`div`);
            thisCol.appendChild(div)
            thisRow.appendChild(thisCol);

            //modify data on those elements
            thisCol.id=`r${col}c${row}`;
            div.className="content";
            if(debug) thisCol.innerHTML=`${thisCol.id}`;
        }
    }
}