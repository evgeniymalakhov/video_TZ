const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const socketRouter = require('./routers');

app.use(cors());
app.use(express.static(`${__dirname}/assets`));

server.listen(process.env.PORT || 3000, async () => {
    await socketRouter(io);
});

module.exports = server;
