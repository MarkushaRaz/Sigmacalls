// server.js

const WebSocket = require('ws');

// Запускаем WebSocket сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('Простой сигнальный WS сервер запущен на порту 8080');

wss.on('connection', ws => {
  console.log('Клиент подключился');

  ws.on('message', message => {
    // Получаем сообщение и пересылаем его всем, кроме отправителя
    console.log('Получено сообщение =>', message.toString());
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });

  ws.on('error', error => {
    console.error('Ошибка WebSocket:', error);
  });
});