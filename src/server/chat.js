const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const app = express()
const cors = require('cors');
const http = require('http')
const server = http.createServer(app);


app.use(cors({
    origin: 'http://localhost:3000', // Ваш клиентский URL
    methods: ['GET', 'POST']
  }));

const io = new Server(server, {
cors: {
    origin: 'http://localhost:3000', // Разрешаем подключение только с этого адреса
    methods: ['GET', 'POST'],
    credentials: true
}
});

app.use(cors())

const users = []

let messages = [];

io.on('connect', (socket) => {
    

    // socket.emit('load_history', messages)

    socket.on('join_room', async (data) => {
        await socket.leave(data.lastId)
        await socket.join(data.newId)
        messages = [...data.newMessages]
        socket.emit('load_history')

    })

    socket.on('send_message', (message) => {

        messages.push(message)
        
        io.to(message.room).emit('create_message', message)
    })

    socket.on('disconnect', () => {
        
        
    })
    
})

server.listen(5600, () => {
    
    
})
