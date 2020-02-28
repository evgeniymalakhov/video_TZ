const server = require('../server').listen(3000);
const io = require('socket.io-client');
const fs = require('fs');
const assert = require('assert');
const { SocketIOFileClient } = require('socket.io-file-client');

describe('Tests socket video', () => {
    let socket;
    let uploader;

    beforeEach(done => {
        socket = io.connect('http://localhost:3000');
        uploader = new SocketIOFileClient(socket);
    });

    it('upload video', async done => {
        const file = fs.readFile('./test_data/videoplayback.mp4');
        uploader.upload(file);
        uploader.on('complete', function(fileInfo) {});
        uploader.on('error', function(err) {
            console.log('Error!', err);
        });
        uploader.on('abort', function(fileInfo) {
            console.log('Aborted: ', fileInfo);
        });
    });
});
