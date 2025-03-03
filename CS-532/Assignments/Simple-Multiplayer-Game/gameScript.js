const debug=false;
direction = {
    UP:    "up",
    DOWN:  "down",
    LEFT:  "left",
    RIGHT: "right",
    NONE:  "none"
};


let players = {
    P1:null,
    P2:null,
    P3:null,
    P4:null,
}

let gameBoard=null;
const numRows = 100
const numCols = 100

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            thisCol.id=`R${col}C${row}`;
            div.className="content";
            if(debug) thisCol.innerHTML=`${thisCol.id}`;
            
        }
        
        gameBoard[row] = new Array(numCols).fill(-1)
    }
}

function print_gamelog(text){
    //We want all player references to be their color in the textbox.
    
    let player_names = []
    for(const player of Object.values(players)){
        if(player!=null){
            player_names.push(player.name)
        }
    }
    
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


// Runs once upon the page being loaded and/or when the 'newgame' button is pressed
async function gamesetup(){
    gamecleanup()
    document.getElementById("startButton").classList.toggle(`hidden`,true)

    // Create the snakes
    players.P1 = new Snek("Player1", "KeyW",    "KeyS",      "KeyA",      "KeyD",       direction.RIGHT, 2,         2,         50);
    players.P2 = new Snek("Player2", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", direction.LEFT,  numRows-3, numCols-3, 50);
    // players.P3 = new Snek("Player3", "KeyW",    "KeyS",      "KeyA",      "KeyD",       direction.DOWN,  numRows-3, 2);
    // players.P4 = new Snek("Player4", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", direction.UP,    2,         numCols-3);

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
        if(player != null ){
            if(player.alive==2){
                player.move()
                const cell = document.getElementById(`R${player.posX}C${player.posY}`)
                cell.classList.toggle(`${player.name}`,true)
                numPlayersRemaining++
                winner = player.name
            }
            else{
                print_gamelog(player.name + " Died.", player.name)
                player.alive=0
            }
        }
    }

    //check if the game needs to end
    if(numPlayersRemaining < 2){
        print_gamelog(winner + " Wins!")
        document.getElementById("startButton").classList.toggle(`hidden`,false)
        gameloop_timer_stop()
        
    }

    //sweep through and wipe any cells that have timed out
    for(let row = 0;row<gameBoard.length;row++){
        for(let col = 0;col<gameBoard.length;col++){
            
            // if undefined, do nothing
            if(gameBoard[row][col] < 0 ) {/* pass */}
            
            // handle timeout for all cells
            else if(gameBoard[row][col] > 0) { gameBoard[row][col] -= 1; }

            // wipe cells that have timed out
            else if (gameBoard[row][col] == 0) {
                gameBoard[row][col] = -1
                const cell = document.getElementById(`R${row}C${col}`)
                for(const player of Object.values(players)){
                    if(player != null){
                        cell.classList.toggle(`${player.name}`,false)
                    }
                }
            
            // this doesnt need to exist. Don't worry about it.
            }else{
                console.error(`Game loop failed on board update: [${row}][${col}] = '${gameBoard[row][col]}'`)
            }

        }

    }
}








class Snek{

    constructor(name, up, down, left, right, facing, posX, posY, tail){
        // object metadata
        this.name = name;
        this.facing = facing;
        this.posX = posX;
        this.posY = posY;
        this.tail = tail;

        //controls
        this.up=up;
        this.down=down;
        this.left=left;
        this.right=right;
        this.alive = 2
        
        this.controls = document.addEventListener('keydown',(key)=>{
            if(key.code===this.up)    this.setDirection(direction.UP)
            if(key.code===this.down)  this.setDirection(direction.DOWN)
            if(key.code===this.left)  this.setDirection(direction.LEFT)
            if(key.code===this.right) this.setDirection(direction.RIGHT)
        });
        
        gameBoard[this.posX][this.posY] = this.tail

    }

    //change the current direction of the snek, but do not allow full turn-arounds
    setDirection(input){
        if     (this.facing === direction.UP    && input === direction.DOWN ){/* pass */}
        else if(this.facing === direction.DOWN  && input === direction.UP   ){/* pass */}
        else if(this.facing === direction.LEFT  && input === direction.RIGHT){/* pass */}
        else if(this.facing === direction.RIGHT && input === direction.LEFT ){/* pass */}
        else{
            this.facing = input
            console.log(`${this.name} is facing ${this.facing}`)
        }
    }

    move(){
        try{
            if(!this.alive) return;
            let oldX=this.posX
            let oldY=this.posY
            //move the player
            if(this.facing===direction.UP)   { this.posY-=1 }
            if(this.facing===direction.DOWN) { this.posY+=1 }
            if(this.facing===direction.LEFT) { this.posX-=1 }
            if(this.facing===direction.RIGHT){ this.posX+=1 }
            
            //check bounds
            if(this.posX<0 || this.posX>numRows-1 || this.posY<0 || this.posY>numCols-1){
                this.die()
                this.posX=oldX
                this.posY=oldY
                console.log(`${this.name} lost: Out of bounds.`)
                
            }

            //check collision
            else if(gameBoard[this.posX][this.posY]!=-1){
                this.die()
                this.posX=oldX
                this.posY=oldY
                console.log(`${this.name} lost: Snek collision.`)
            }

            //update collision
            else{
                gameBoard[this.posX][this.posY] = this.tail
            }
        }catch(err){
            console.error(`${this.name}: ${err}`)
        }
    }

    die(){
        this.facing=direction.NONE
        this.alive=1
        this.controls = document.removeEventListener('keydown',(key)=>{
            if(key.code===this.up)    this.setDirection(direction.UP)
            if(key.code===this.down)  this.setDirection(direction.DOWN)
            if(key.code===this.left)  this.setDirection(direction.LEFT)
            if(key.code===this.right) this.setDirection(direction.RIGHT)
        });
    }

}