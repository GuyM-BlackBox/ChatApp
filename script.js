const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

var myChatId = '';

const chatId = prompt('What is your Chat id? (to create new Chat enter 999)');
if(chatId === '999'){
    const password = prompt('Create your new chat password:');
    socket.emit('create-new-chat', {chatId: chatId, password: password});
}
else{
    const password = prompt('Enter the chat password:');
    socket.emit('new-chat', {chatId: chatId, password: password});
}

// Chat ID and Passwords
socket.on('chat-created', data => {
    appendMessage(`New Chat Created Successfully!\nYour Chat ID is: ${data.chatId}  (Share it with your Friends!)\nYour Password is: ${data.password}`);
    const username = prompt('Please Enter your Username:');
    appendMessage(`You connected!`);
    myChatId = data.chatId;
    socket.emit('new-user', {chatId: data.chatId, user: username});
});
socket.on('chat-found', chatId => {
    const username = prompt('Please Enter your Username:');
    appendMessage(`Welcome to Chat: ${chatId}`);
    appendMessage(`You connected!`);
    myChatId = chatId;
    socket.emit('new-user', {chatId: chatId, user: username});
});
socket.on('wrong-password', chatId => {
    const password = prompt('Wrong Password! Please Enter Password Again: (or Refresh Page to Enter New Chat ID');
    socket.emit('new-chat', {chatId: chatId, password: password});
});
socket.on('chat-not-found', oldChatId => {
    const chatId = prompt('Chat ID not Found: Enter your Chat ID (or Enter 999 to Create new Chat)');
    if(chatId === '999'){
        const password = prompt('Create your new chat password:');
        socket.emit('create-new-chat', {chatId: chatId, password: password});
    }
    else{
        const password = prompt('Enter the chat password:');
        socket.emit('new-chat', {chatId: chatId, password: password});
    }
});


// User Connection
socket.on('user-connected', data => {
    if(myChatId === data.chatId){
        appendMessage(`${data.name} connected`);
    }
});
socket.on('user-disconnected', data => {
    appendMessage(`${data.name} disconnected`);
    if(myChatId === data.chatId){
        appendMessage(`${data.name} disconnected`);
    }
});


// Messaging
socket.on('chat-message', data => {
    if(myChatId === data.chatId){
        appendMessage(`${data.name}: ${data.message}`);
    }
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
})

function appendMessage(message){
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}