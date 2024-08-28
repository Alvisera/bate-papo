const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('message', message => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'JOIN':
                broadcast({ user: parsedMessage.user, text: 'entrou na sala', type: 'JOIN' }, socket);
                break;
            case 'CHAT':
                broadcast({ user: parsedMessage.user, text: parsedMessage.text, type: 'CHAT' }, socket);
                break;
            case 'LEAVE':
                broadcast({ user: parsedMessage.user, text: 'saiu da sala', type: 'LEAVE' }, socket);
                break;
        }
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});

function broadcast(message, senderSocket) {
    server.clients.forEach(client => {
        if (client !== senderSocket && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

console.log('Servidor WebSocket rodando na porta 8080');