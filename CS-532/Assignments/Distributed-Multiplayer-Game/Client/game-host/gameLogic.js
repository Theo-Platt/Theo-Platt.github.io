
const starter = {
    "P1":{"name":"Player1", "dir":direction.RIGHT, "posX":2,         "posY":2},
    "P2":{"name":"Player2", "dir":direction.LEFT,  "posX":numRows-3, "posY":numCols-3},
    "P3":{"name":"Player3", "dir":direction.DOWN,  "posX":numRows-3, "posY":2},
    "P4":{"name":"Player4", "dir":direction.UP,    "posX":2,         "posY":numCols-3}
}
let intervalId=null;
var board = undefined
var gameRunning = undefined
var players = undefined
var socks = undefined


function Assigned_Host_Role(){
    board = new GameBoard()
    gameRunning = false
    socks = {}
    players = {
        "P1":null,
        "P2":null,
        "P3":null,
        "P4":null
    }

    socket.on('Join Game',function(player){
        let playerAdded=false
        console.log(players)
        for(let k of Object.keys(players)){
            if(gameRunning) break
            
            if(players[`${k}`]==null){
                let start = starter[`${k}`]
                players[`${k}`] = new Snek(player,start.name,start.dir, start.posX,start.posY, 100)
                let msg={
                    id:player,
                    content:`You are ${players[`${k}`].name}`,
                    emit:{sender:`${players[`${k}`].name}`,message:`Joined the game.`},
                    role:"Player"
                }
                socket.emit('Server Message',msg)
                playerAdded=true
                console.log(`Assigned ${players[`${k}`].name}`)
                break
            }
        }
        if(!playerAdded){
            let msg={
                id:player,
                content:`You are a Spectator`,
                emit:{sender:`Spectator`,message:`Joined the game.`},
                role:"spectator"
            }
            socket.emit('Server Message',msg)
        }
        console.log(players)
    });
    
    
    socket.on('player disconnect',(id)=>{
        console.log(`Player Disconnected`)
        for(let p of Object.keys(players)){
            if(players[`${p}`] != null && players[`${p}`].id==id){
                console.log(`Removing ${players[`${p}`].name}`)
                emitMessage(`Disconnected.`,players[`${p}`].name)
                players[`${p}`] = null
            }
        }
    })
    
    socket.on('input',(msg)=>{
        if(gameRunning){
            let id = msg.id
            let dir = msg.dir
    
            players[socks[id]].setDirection(dir)
        }
    })
}














// Runs once upon the page being loaded and/or when the 'newgame' button is pressed
async function gamesetup(){
    let numP = 0
    socks = {}
    for(let p of Object.keys(players)){
        if(players[`${p}`] != null){
            numP++
            socks[players[`${p}`].id] = `${p}`
        }
    }
    if(numP < 2){
        emitMessage(`Not enough players to start a game.`)
        return
    }
    console.log('game setup running')
    gamecleanup()
    
    document.getElementById("startButton").classList.toggle(`hidden`,true)

    socket.emit('GameLoop',board.getGameBoard())
    // run the game
    
    
    
    emitMessage("Get Ready.")
    await sleep(1000)
    emitMessage("Get Set.")
    await sleep(1000)
    emitMessage("Go!")
    gameRunning = true
    timer_start()
}

function gamecleanup(){
    board.resetGameBoard()

    socket.emit('GameLoop',board.getGameBoard())

    for(let p of Object.keys(players)){
        let key = [`${p}`]
        if(players[key] != null)
            players[key] = new Snek(players[key].id, starter[key].name, starter[key].dir, starter[key].posX, starter[key].posY, 100)
    }
}


function timer_start() {
    console.log('start timer')
    intervalId = setInterval(() => {gameloop();}, 50);
}

function timer_stop() {
    console.log('stop timer')
    clearInterval(intervalId);
    gameRunning = false
}


function gameloop(){
    //draw the previous board state
    board.passTime()
    socket.emit('GameLoop',board.getGameBoard())

    //set the cells of players 'head' to their color
    let numPlayersRemaining = 0
    let winner = "Nobody"
    for(const [key,player] of Object.entries(players)){
        if(player != null && player.alive){
            player.move()
            let posKey = board.getKey(player.posX, player.posY)
            if( board.movePlayer(posKey, player.name, player.tail) ){
                numPlayersRemaining++
                winner = player.name
            }else{
                player.die()
                emitMessage(player.name + " Died.")
            }
        }
    }

    //check if the game needs to end
    if(numPlayersRemaining < 2){
        emitMessage(`${winner} Wins!`)
        timer_stop()
        document.getElementById("startButton").classList.toggle(`hidden`,false) 
    }
}