const fs = require('fs');
const shortid = require('shortid');
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const SocketIOFile = require('socket.io-file');
const { uploadPath, thumbnailPath, supportedTypes } = require('../config/config');

const uploadVideo = socket => {
    const uploader = new SocketIOFile(socket, {
        uploadDir: uploadPath,
        accepts: supportedTypes,
        chunkSize: 10000000, // (1.25MB)
        transmissionDelay: 0,
        overwrite: false,
        rename: fileName => {
            return `${shortid.generate()}.${fileName.split('.').pop()}`;
        }
    });
    uploader.on('complete', async file => {
        const tg = new ThumbnailGenerator({
            sourcePath: `${uploadPath}/${file.name}`,
            thumbnailPath: thumbnailPath
        });
        await tg.generateOneByPercent(1);
        io.emit('error', file);
    });
    uploader.on('error', async err => {
        io.emit('error', err);
    });
    uploader.on('abort', async fileInfo => {
        io.emit('error', fileInfo);
    });
};

const getVideoList = async socket => {
    console.log(socket);
    socket.on('videoList', async () => {
        fs.readdir(uploadPath, (err, files) => {
            let data = [];
            files = files.filter(item => item !== '.gitkeep');
            if (files) {
                data = files.map(item => {
                    const name = item.substring(0, item.lastIndexOf('.'));
                    const video = `/videos/${item}`;
                    const thumb = '/thumbnails/' + fs.readdirSync(thumbnailPath).find(thumb => thumb.indexOf(name) !== -1) || null;
                    return { name, video, thumb };
                });
            }
            socket.emit('videoListResult', data);
        });
    });
};

module.exports = {
    uploadVideo,
    getVideoList
};
