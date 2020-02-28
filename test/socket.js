const io = require('socket.io-client');
const fs = require('fs');
const expect  = require('chai').expect;
const SocketIOFileClient = require('socket.io-file-client');

describe('Tests socket video', () => {
    let socket = io('http://localhost:3000');
    let uploader = new SocketIOFileClient(socket);

    it('upload video', async done => {
        const data = { files : null };
        data.files = [fs.readFileSync('./test/test_data/videoplayback.mp4')];
        const uploaderIds = uploader.upload(data, {
            data: {}
        });
        uploader.on('complete', function(fileInfo) {
            console.log('complited!')
        });
        uploader.on('error', function(err) {
            console.log('Error!', err);
        });
        uploader.on('abort', function(fileInfo) {
            console.log('Aborted: ', fileInfo);
        });
        done()
    });
});
