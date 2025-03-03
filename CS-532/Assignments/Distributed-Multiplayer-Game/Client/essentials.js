var socket = io();
var debug=false
var numRows=100
var numCols=100

function updateChatlog(str, usr){
    let msg = {"usr":usr,"str":str}
    socket.emit('update chatlog',msg)
}

socket.on('update chatlog',function(msg){
    console.log(msg)
    let text
    if(msg.usr!=undefined){
        text = `${msg.usr}: ${msg.str}`
    }else{
        text = `Server: ${msg.str}`
    }

    print_gamelog(text)

});

socket.on('GameLoop',function(board){
    draw(board)
})

socket.on('Host Notification',function(){
    console.log("I am the host.")
    let s1=document.createElement('script')
    s1.src='GameBoard.mjs'
    s1.type="module"
    document.getElementById('body').appendChild(s1)
    
    let s2=document.createElement('script')
    s2.src='Snek.mjs'
    s2.type="module"
    document.getElementById('body').appendChild(s2)

    let s3=document.createElement('script')
    s3.src='HostScript.js'
    document.getElementById('body').appendChild(s3)
})



// Direction Enum
direction = {
    UP:    "up",
    DOWN:  "down",
    LEFT:  "left",
    RIGHT: "right",
    NONE:  "none"
};

function onload(){
    const tabletop_holder = document.getElementById("tableHolder");
    const tabletop = document.createElement(`table`);
    tabletop_holder.appendChild(tabletop)

    //create game board and accompanying data matrix
    gameBoard = []

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
        
        gameBoard[row] = new Array(numCols).fill(-1)
    }
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
                span.style.color='yellow'
                break;
            default:
        }
        info.appendChild(span)
    });

    
    gameLog = document.getElementById("gameLog")
    gameLog.insertBefore(info, gameLog.firstChild);
}


//Draw takes a 2D array of integers as input and modifies the DOM's table to align with it.
function draw(gameBoard){
    let keys = []
    for(key in Object.keys(gameBoard))
        keys.push(key)
    for(let row=0;row<100;row++){
        for(let col=0;col<100;col++){
            id = `r${row}c${col}`

            if(keys.indexOf(id) != -1){
                document.getElementById(id).classList.add(`${gameBoard.getPositionValue(id)}`)
            }else{
                document.getElementById(id).removeAttribute("class")
            }
        }
    }
}