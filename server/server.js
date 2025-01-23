const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const invoiceRoutes = require('./routes/invoice');
const logger = require('./config/logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', invoiceRoutes);

io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});