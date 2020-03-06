const socketio=require('socket.io');
const io=socketio();

const socketApi={};
socketApi.io=io;

const users=[];

io.on('connection', (socket)=>{
    console.log('User Connected');

    //datadan username gelir.
    socket.on('newUser', (data)=>{
        const defaultData={
            id: socket.id,
            position:{
                x:0,
                y:0
            }
        }

        //iki objeyi birleştirmek için assign methodu kullanılır.
        const userData=Object.assign(data,defaultData);
        users.push(userData);

        socket.broadcast.emit('newUser', (userData));
    })
})

module.exports=socketApi;