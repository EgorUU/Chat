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
    console.log("Новый пользователь подключился", socket.id);
    // socket.on('join_room', (users) => {
    //     console.log('join room');
    //     socket.join('room_' + roomId) // Создаем новую комнату
    //     socket.emit('push_roomId', roomId)
    //     io.to('room_' + roomId).emit('create_message', {text: "Комната Создана! id: " + roomId, userId: 10 , userName: "Chat", time: `${new Date().getHours() > 9 ? new Date().getHours() : "0" + new Date().getHours()}:${new Date().getMinutes() > 9 ? new Date().getMinutes() : "0" + new Date().getMinutes()}`})

        
    // })
    socket.emit('load_history', messages)

    // socket.on('push_user', (user) => {
    //     console.log('push node');
        
    //     users.push(user)
    //     io.emit('show_users', users)
    // })

    socket.on('send_message', (message) => {

        messages.push(message)

        console.log(messages);
            

    // /*Указываем на комнату -> */ io.to('new_room')./* И отправляем запрос на создание сообщения */emit('create_message', message)
        io.emit('create_message', message)
    })

    socket.on('disconnect', () => {
        console.log('Пользователь отключился', socket.id);
        
    })
    
})

server.listen(5600, () => {
    console.log("Сервер для Websocket запущен");
    
})
