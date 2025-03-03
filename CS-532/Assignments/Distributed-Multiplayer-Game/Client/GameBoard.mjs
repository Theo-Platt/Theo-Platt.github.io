export class GameBoard{

    constructor(){
        let boardState = {}
    }

    getKey(row,col){
        return `r${row}c${col}`
    }

    #getRowCol(str) {
        const match = str.match(/^r(\d+)c(\d+)$/);
        if (!match) {
            throw new Error("Invalid format");
        }
        return {
            row: parseInt(match[1], 10),
            col: parseInt(match[2], 10)
        };
    }

    #exists(k){
        if(k in boardState)
            return true
        return false
    }

    #setPositionValue(k,val){
        if(this.#exists(k)){
            boardState.k.value = val
            return true
        }
        return false
    }
    getPositionValue(k){
        if(this.exists(k)){
            return boardState.k.value
        }
        return undefined
    }

    #setPositionID(k,id){
        if(this.#exists(k)){
            boardState.k.id = id
            return true
        }
        return false
    }
    getPositionID(k){
        if(this.exists(k)){
            return boardState.k.id
        }
        return undefined
    }

    #setPosition(k,id,val){
        boardState.k = {"id":id,"value":val}
    }
    getPosition(k){
        if(this.exists(row,col)){
            return boardState.getKey(row,col)
        }
        return undefined
    }

    #deletePosition(k){
        if(this.exists(k)){
            delete boardState.k
            return true
        }
        return false
    }
    
    getGameBoard(){
        return boardState
    }

    resetGameBoard(){
        for(k in Object.keys(boardState)){
            this.#deletePosition(k)
        }
    }
    
    movePlayer(k,id,value){
        if(this.#exists(k))
            return false

        pos = getRowCol(k)
        if(pos.row < 0 || pos.row >= 100 || pos.col < 0 || pos.col >= 100)
            return false

        this.#setPosition(k,id,value)
        return true
    }

    passTime(){
        for(k in Object.keys(boardState)){
            this.#setPositionValue(k, this.getPositionValue(k) - 1)
            if(this.getPositionValue(k) <= 0){
                this.#deletePosition(k)
            }
        }
    }

    


}