const fs = require('fs');
const util = require('util')
const shortid = require('shortid');
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const SocketIOFile = require('socket.io-file');
const readdir = util.promisify(fs.readdir);
const {
    uploadPath,
    thumbnailPath,
    supportedTypes,
    thumbnailUrl,
    videoUrl
} = require('../config/config');

const scanVideoDirectory = async () => {
    let files = await readdir(uploadPath);
    return files.filter(item => item !== '.gitkeep');
}

const findVideoByName = async name => {
    const files = await scanVideoDirectory();
    return files.filter( file => file.startsWith(name))
}

const findThumbnailsByName = async name => {
    const thumbs = await readdir(thumbnailPath);
    return thumbs.filter( thumb => thumb.startsWith(name));
}

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
    });
    uploader.on('error', async err => {
        socket.emit('error', err);
    });
    uploader.on('abort', async fileInfo => {
        socket.emit('error', fileInfo);
    });
};

const getVideoList = async socket => {
    socket.on('videoList', async () => {
        try {
            let files = await scanVideoDirectory();
            let data = [];
            if (files) {
                data = files.map(item => {
                    const name = item.substring(0, item.lastIndexOf('.'));
                    const video = `${videoUrl}/${item}`;
                    const thumb = `${thumbnailUrl}/${fs.readdirSync(thumbnailPath)
                        .find(thumb =>
                            thumb.indexOf(name) !== -1) || null}`;

                    return { name, video, thumb };
                });
            }
            socket.emit('videoListResult', data);
        } catch (e) {
            socket.emit('error', e)
        }
    });
};

const removeVideo = async socket => {
    socket.on('videoRemove', async ({ video }) => {
        const videos = await findVideoByName(video);
        const thumbs = await findThumbnailsByName(video);
        for (let v of videos) {
            fs.unlink(`${uploadPath}/${v}`, async err => {
                if (err) {
                    socket.emit('error', err);
                }
            });
        }

        for (let t of thumbs) {
            fs.unlink(`${thumbnailPath}/${t}`, async err => {
                if (err) {
                    socket.emit('error', err);
                }
            });
        }
    });
}

module.exports = {
    uploadVideo,
    getVideoList,
    removeVideo
};
