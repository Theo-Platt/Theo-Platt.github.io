socket.on('GameLoop',function(board){
    console.log(`Graphics Gameloop`)
    draw(board)
})

//Draw takes a 2D array of integers as input and modifies the DOM's table to align with it.
function draw(gameBoard){
    let keys = []
    for(let key of Object.keys(gameBoard)){
        keys.push(key)
        

    }
    
    for(let row=0;row<100;row++){
        for(let col=0;col<100;col++){
            id = `r${row}c${col}`
            // console.log(`id: ${id}`)
            if(keys.indexOf(id) != -1){
                
                document.getElementById(id).classList.add(`${gameBoard[`${id}`].id}`)
            }else{
                
                document.getElementById(id).removeAttribute("class")
            }
        }
    }
}