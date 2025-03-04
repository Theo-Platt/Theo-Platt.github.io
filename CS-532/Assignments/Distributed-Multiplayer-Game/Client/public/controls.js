document.addEventListener('keydown',(key)=>{
    if(key.code==="ArrowUp")    {
        socket.emit('input',direction.UP)
        console.log('Pressed ArrowUp')

    }
    if(key.code==="ArrowDown")  {
        socket.emit('input',direction.DOWN)
        console.log('Pressed ArrowDown')
    }
    if(key.code==="ArrowLeft")  {
        socket.emit('input',direction.LEFT)
        console.log('Pressed ArrowLeft')
    }
    if(key.code==="ArrowRight") {
        socket.emit('input',direction.RIGHT)
        console.log('Pressed ArrowRight')
    }
});