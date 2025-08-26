import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(process.cwd(), 'public')));

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Client connected. Total:', clients.length);

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);

    if (data.type === 'ready') {
      if (clients.length === 2) {
        // Назначаем роли
        clients[0].send(JSON.stringify({ type: 'start', role: 'caller' }));
        clients[1].send(JSON.stringify({ type: 'start', role: 'callee' }));
      }
    } else {
      // Пересылаем сообщения другому клиенту
      clients.forEach(c => {
        if (c !== ws && c.readyState === ws.OPEN) {
          c.send(msg);
        }
      });
    }
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port', PORT));