class GameBoard{

    constructor(){
        this.boardState = {}
    }

    getKey(row,col){
        return `r${row}c${col}`
    }

    #getRowCol(str) {
        const match = str.match(/^r(\d+)c(\d+)$/);
        if (!match) {
            return undefined
        }
        return {
            row: parseInt(match[1], 10),
            col: parseInt(match[2], 10)
        };
    }

    #exists(k){
        if(k in this.boardState)
            return true
        return false
    }

    #setPositionValue(k,val){
        if(this.#exists(k)){
            this.boardState[`${k}`].value = val
            return true
        }
        return false
    }
    getPositionValue(k){
        if(this.#exists(k)){
            return this.boardState[`${k}`].value
        }
        return undefined
    }

    #setPositionID(k,id){
        if(this.#exists(k)){
            this.boardState[`${k}`].id = id
            return true
        }
        return false
    }
    getPositionID(k){
        if(this.exists(k)){
            return this.boardState[`${k}`].id
        }
        return undefined
    }

    #setPosition(k,id,val){
        this.boardState[`${k}`] = {"id":id,"value":val}
    }
    getPosition(k){
        if(this.exists(row,col)){
            return this.boardState.getKey(row,col)
        }
        return undefined
    }

    #deletePosition(k){
        if(this.#exists(k)){
            delete this.boardState[`${k}`]
            return true
        }
        return false
    }
    
    getGameBoard(){
        return this.boardState
    }

    resetGameBoard(){
        for(let k of Object.keys(this.boardState)){
            this.#deletePosition(k)
        }
    }
    
    movePlayer(k,id,value){
        if(this.#exists(k))
            return false

        let pos = this.#getRowCol(k)
        
        if(pos==undefined)
            return false

        if(pos.row < 0 || pos.row >= 100 || pos.col < 0 || pos.col >= 100)
            return false

        this.#setPosition(k,id,value)
        return true

        
    }



    passTime(){
        for(let k of Object.keys(this.boardState)){
            this.#setPositionValue(k, this.getPositionValue(k) - 1)
            if(this.getPositionValue(k) <= 0){
                this.#deletePosition(k)
            }
        }
    }

    to_string(){
        let str = ``
        for(let key of Object.keys(this.boardState)){
            str = str + `[${key},[${this.boardState[key].id},${this.boardState[key].value}]] `
        }
        return str
    }


}