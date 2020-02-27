const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const indexRouter = require('./routers/index');

app.use(cors());

app.use(express.static(`${__dirname}/assets`));
app.use('/video', indexRouter);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server runs on port: ' + server.address().port);
});
