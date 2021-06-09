const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const chatId = prompt('What is your Chat id? (to create new Chat enter 999)');
if(chatId === '999'){
    const password = prompt('Create your new chat password:');
    socket.emit('create-new-chat', {chatId: chatId, password: password});
}
else{
    const password = prompt('Enter the chat password:');
    socket.emit('new-chat', {chatId: chatId, password: password});
}

socket.on('chat-created', data => {
    appendMessage(`New Chat Created Successfully!\nYour Chat ID is: ${data.chatId}  (Share it with your Friends!)\nYour Password is: ${data.password}`);
    const username = prompt('Please Enter your Username:');
    appendMessage(`You connected!`);
    socket.emit('new-user', {chatId: data.chatId, user: username});
});

socket.on('chat-found', chatId => {
    const username = prompt('Please Enter your Username:');
    appendMessage(`Welcome to Chat: ${chatId}`);
    appendMessage(`You connected!`);
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

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
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