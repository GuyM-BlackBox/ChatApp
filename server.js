const PORT = process.env.PORT || 3000;
const io = require('socket.io')(PORT, {cors: { origin: "*", },});
const Chats = require('./models/chats.js');
const mongoose = require('mongoose');

const url = 'mongodb+srv://admin:admin@cluster0.ef9b4.mongodb.net/chatApp';
const connect = mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

const users = {};
const userChatId = {};

connect.then((db) => {
    console.log('Connected correctly to MongoDB');

    io.on('connection', socket => {
        socket.on('disconnect', name => {
            socket.broadcast.emit('user-disconnected', users[socket.id]);
            delete users[socket.id];
        })
        socket.on('create-new-chat', data => {
            if(data.chatId === '999'){
                Chats.create({ password: data.password, messages: []})
                .then((chat) => {
                        console.log('Chat Created', chat);
                        socket.emit('chat-created', {chatId: chat._id, password: data.password});
                }, (err) => console.log(err))
                .catch((err) => console.log(err));
            }
            else{
                console.log("SERVER ERROR: [create-new-chat]: ChatId not 999!");
            }
        })
        socket.on('new-chat', data => {
            Chats.findById(data.chatId)
            .then((chat) => {
                if(chat !== null){
                    console.log('SERVER: Chat found!', chat);
                    if(chat.password === data.password){
                        console.log('Correct password!'); 
                        socket.emit('chat-found', data.chatId);
                    }
                    else{
                        console.log('Wrong password!');
                        socket.emit('wrong-password', data.chatId);
                    }
                }
                else{
                    console.log('SERVER: Chat not found!');
                    socket.emit('chat-not-found', data.chatId);
                }
            }, (err) => console.log(err))
            .catch((err) => console.log(err));
        })
        socket.on('new-user', data => {
            users[socket.id] = data.user;
            userChatId[socket.id] = data.chatId;
            socket.broadcast.emit('user-connected', {name: users[socket.id], chatId: userChatId[socket.id]});
        })
        socket.on('disconnect', name => {
            socket.broadcast.emit('user-disconnected', {name: users[socket.id], chatId: userChatId[socket.id]});
            delete users[socket.id];
        })
        socket.on('send-chat-message', message => {
            socket.broadcast.emit('chat-message', { message: message, name: users[socket.id], chatId: userChatId[socket.id]});  
        })
    })
});
