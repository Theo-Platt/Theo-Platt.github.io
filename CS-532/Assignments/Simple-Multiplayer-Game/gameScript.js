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




// Runs once upon the page being loaded and/or when the 'newgame' button is pressed
function gamesetup(){

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
    

    // Create the snakes
    players.P1 = new Snek(name="Player1", up="KeyW", down="KeyS",left="KeyA",right="KeyD", facing=direction.RIGHT,posX=0,posY=0);
    players.P2 = new Snek(name="Player2",up="ArrowUp", down="ArrowDown",left="ArrowLeft",right="ArrowRight", facing=direction.LEFT,posX=numRows-1,posY=numCols-1);
    players.P3 = new Snek(name="Player3", up="KeyW", down="KeyS",left="KeyA",right="KeyD", facing=direction.DOWN,posX=numRows-1,posY=0);
    players.P4 = new Snek(name="Player4",up="ArrowUp", down="ArrowDown",left="ArrowLeft",right="ArrowRight", facing=direction.UP,posX=0,posY=numCols-1);

    // run the game
    gameloop_timer_start()

}


//thanks to google's AI overview on the search criteria: "js timer interrupt routine" (just citing sources ^-^)
let intervalId;

function gameloop_timer_start() {
    intervalId = setInterval(() => {
    // console.log("Gameloop Frame");
    gameloop();
    }, 50);
}

function gameloop_timer_stop() {
    clearInterval(intervalId);
}

function gameloop(){
    //set the cells of players 'head' to their color
    for(const player of Object.values(players)){
        if(player != null ){
            if(player.alive){
                player.move()
                const cell = document.getElementById(`R${player.posX}C${player.posY}`)
                cell.classList.toggle(`${player.name}`,true)
            }
        }
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
                console.error("Game loop failed on board update")
            }

        }

    }
}








class Snek{

    constructor(name, up, down, left, right, facing = direction.NONE, posX=0, posY=0, tail=150){
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
        this.alive = true
        
        document.addEventListener('keydown',(key)=>{
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
        this.alive=false
    }

}