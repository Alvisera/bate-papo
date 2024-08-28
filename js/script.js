let socket;
let username;

function enterChatRoom() {
    username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'block';

        // Conectar ao servidor WebSocket
        socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Conectado ao WebSocket');
            socket.send(JSON.stringify({ type: 'JOIN', user: username }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const messagesContainer = document.getElementById('messages');
            messagesContainer.innerHTML += `<div><b>${message.user}:</b> ${message.text}</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        socket.onclose = () => {
            console.log('Desconectado do WebSocket');
        };
    } else {
        alert('Por favor, escolha um nome de usuário');
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message) {
        socket.send(JSON.stringify({ type: 'CHAT', user: username, text: message }));
        messageInput.value = '';
    }
}

function leaveChat() {
    if (socket) {
        socket.send(JSON.stringify({ type: 'LEAVE', user: username }));
        socket.close();
    }
    document.getElementById('login').style.display = 'block';
    document.getElementById('chat').style.display = 'none';
}

document.getElementById("messageInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendMessage(); 
    }
});

document.getElementById("username").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enterChatRoom(); 
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        if (document.getElementById('chat-room').style.display === 'block') {
            leaveChat();
        }
    }
});