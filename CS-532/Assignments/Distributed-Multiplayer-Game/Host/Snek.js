export class Snek{

    constructor(id, name, facing, posX, posY, tail){
        // object metadata
        this.id = id
        this.name = name;
        this.facing = facing;
        this.posX = posX;
        this.posY = posY;
        this.tail = tail;

        //state tracking
        this.alive = 2
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
        if     (this.facing === direction.UP)    this.posY-=1
        else if(this.facing === direction.DOWN)  this.posY+=1
        else if(this.facing === direction.LEFT)  this.posX-=1
        else if(this.facing === direction.RIGHT) this.posX+=1
    }

    die(){
        this.facing=direction.NONE
        this.alive=false
    }

}