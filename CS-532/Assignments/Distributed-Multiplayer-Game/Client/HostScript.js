import {Snek} from 'Snek.mjs'
import {GameBoard} from './GameBoard.mjs'
console.log("Host Script Running!")
let board = new GameBoard()

let players = {}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

starter = {
    P1:{direction:direction.RIGHT, posX:2,posy:2},
    P2:{direction:direction.LEFT, posX:numRows-3,posy:numCols-3},
    P3:{direction:direction.LEFT, posX:numRows-3,posy:2},
    P4:{direction:direction.UP, posX:2,posy:numCols-3}
}

let pc=1
socket.on('Join Game',function(player){
    players["P"+pc] = new Snek("Player"+id,player.name,starter["P"+pc].direction, starter["P"+pc].posX,starter["P"+pc].posY)
    pc+=1
    //TODO if more than 4 players join, emit to the chat that you are a spectator. Also, figure out how to map each snake to it's player.
});


// Runs once upon the page being loaded and/or when the 'newgame' button is pressed
async function gamesetup(){
    gamecleanup()
    document.getElementById("startButton").classList.toggle(`hidden`,true)

    // Create the snakes
    players.P1 = new Snek("Player1", direction.RIGHT, 2,         2,         300);
    players.P2 = new Snek("Player2", direction.LEFT,  numRows-3, numCols-3, 300);
    // players.P3 = new Snek("Player3", direction.DOWN,  numRows-3, 2);
    // players.P4 = new Snek("Player4", direction.UP,    2,         numCols-3);

    // run the game
    gameloop()
    print_gamelog("Get Ready.")
    await sleep(1000)
    print_gamelog("Get Set.")
    await sleep(1000)
    print_gamelog("Go!")
    gameloop_timer_start()
}

function gamecleanup(){
    for(let row = 0;row<gameBoard.length;row++){
        for(let col = 0;col<gameBoard.length;col++){
            gameBoard[row][col] = -1

            const cell = document.getElementById(`R${row}C${col}`)
            for(const player of Object.values(players)){
                if(player != null){
                    cell.classList.toggle(`${player.name}`,false)
                }
            }
        }
    }

    players.P1 = null
    players.P2 = null
    players.P3 = null
    players.P4 = null
}


//thanks to google's AI overview on the search criteria: "js timer interrupt routine" (just citing sources ^-^)
let intervalId;
function gameloop_timer_start() {
    intervalId = setInterval(() => {gameloop();}, 50);
}

function gameloop_timer_stop() {
    console.log("stopping the timer")
    clearInterval(intervalId);
}



function gameloop(){
    //set the cells of players 'head' to their color
    let numPlayersRemaining = 0
    let winner = "Nobody"
    for(const [key,player] of Object.entries(players)){
        if(player != null && player.alive){
            player.move()
            posKey = board.getKey(player.posX, player.posY)
            if( board.movePlayer(posKey, player.id, player.tail) ){
                numPlayersRemaining++
                winner = player.id
            }else{
                player.die()
                print_gamelog(player.name + " Died.", player.name)
            }
        }
    }

    //check if the game needs to end
    if(numPlayersRemaining < 2){
        
        print_gamelog(winner + " Wins!")
        gameloop_timer_stop()
        
    }

    board.passTime()
    socket.emit('GameLoop',board.getGameBoard())

}








