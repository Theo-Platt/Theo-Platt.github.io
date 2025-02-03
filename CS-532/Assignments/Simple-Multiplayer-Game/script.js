
// ENUM for directional tracking
const direction = {
    UP:    "up",
    DOWN:  "down",
    LEFT:  "left",
    RIGHT: "right",
    NONE:  "none"
};



// Runs once upon the page being loaded and/or when the 'newgame' button is pressed
function gamesetup(){

    

    // Create the snakes
    const Player1=createSnake(name="Player1", up="KeyW", down="KeyS",left="KeyA",right="KeyD");
    const Player2=createSnake(name="Player2",up="ArrowUp", down="ArrowDown",left="ArrowLeft",right="ArrowRight");




    // set random starting position to the snakes

}

function gameloop(){

    // 
    
    
    //
    
    
    //


}


class Snek{
    constructor(name, up, down, left, right, facing = direction.NONE, posX=0, posY=0, tail=0){
        // object name
        this.name=name;

        //controls
        this.up=up;
        this.down=down;
        this.left=left;
        this.right=right;

        //
        this.facing = facing;

        document.addEventListener('keydown',function(key){
            if(key.code===this.up) this.move(direction.UP)
            if(key.code===this.down) this.move(direction.DOWN)
            if(key.code===this.left) this.move(direction.LEFT)
            if(key.code===this.right) this.move(direction.RIGHT)
        });
    }

   move(input){
    if(input===direction.UP){

    }
   }

}