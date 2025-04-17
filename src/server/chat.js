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

const messages = [];

io.on('connect', (socket) => {
    

    socket.emit('load_history', messages)

    // socket.on('push_user', (user) => {
    //     
        
    //     users.push(user)
    //     io.emit('show_users', users)
    // })

    socket.on('send_message', (message) => {

        messages.push(message)

        
            

    // /*Указываем на комнату -> */ io.to('new_room')./* И отправляем запрос на создание сообщения */emit('create_message', message)
        io.emit('create_message', message)
    })

    socket.on('disconnect', () => {
        
        
    })
    
})

server.listen(5600, () => {
    
    
})
