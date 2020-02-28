const {
    uploadVideo,
    getVideoList,
    removeVideo
} = require('../controllers/video');

module.exports = async io => {
    io.on('connection', async socket => {
        await uploadVideo(socket);
        await getVideoList(socket);
        await removeVideo(socket);
    });
};
