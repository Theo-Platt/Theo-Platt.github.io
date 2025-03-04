socket.on('request fragment',()=>{
    frag = 'default'
    if(window.location.hash) {
        frag = window.location.hash.substring(1);
    }
    console.log('frag sent:'+frag)
    socket.emit('request fragment', frag)
})

socket.on('Host Migration',()=>{
    window.location.reload(true);
})


socket.on('Host Notification',async function(){
    console.log("I am the host.")
    

    let s1=document.createElement('script')
    s1.src='./game-host/GameBoard.mjs'
    s1.type="module"
    document.getElementById('head').appendChild(s1)
    
    let s2=document.createElement('script')
    s2.src='./game-host/Snek.mjs'
    s2.type="module"
    document.getElementById('head').appendChild(s2)

    let s3=document.createElement('script')
    s3.src='./game-host/gameLogic.js'
    s3.type="module"
    document.getElementById('head').appendChild(s3)

    await sleep(100)
    socket.emit('Join Game',{id:null,name:null})

})

socket.on('Non-Host Notification',async function(){
    document.getElementById('startButton').classList.add('hidden',true)
    await sleep(100)
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