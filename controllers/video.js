const fs = require('fs');
const path = require('path');
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const { uploadPath, thumbnailPath } = require('../config/config');

class VideoController {
    static async getList(req, res) {
        fs.readdir(uploadPath, (err, files) => {
            const data = files.map(item => {
                const name = item.substring(0, item.lastIndexOf('.'));
                const video = `/videos/${item}`;

                return { name, video };
            });
            res.status(200).json(data);
        });
    }

    static async getVideo(req, res) {
        res.status(200).json({ message: 'Hello world from getVideo' });
    }

    static async uploadVideo({ files: { videos } }, res) {
        const fileResult = await Promise.all(
            videos.map(async file => {
                const readStream = fs.createReadStream(file.buffer);
                const writeStream = fs.createWriteStream(path.join(uploadPath, file.originalname));

                await new Promise((resolve, reject) => {
                    readStream.pipe(writeStream);

                    writeStream.on('data', async data => {
                        writeStream.write({
                            rx: data.length / file.size
                        });
                    });

                    writeStream.on('error', async e => {
                        return reject(e);
                    });

                    writeStream.on('finish', async () => {
                        console.log('debug', { message: 'uploading completed' });
                        return resolve();
                    });

                    writeStream.on('end', async () => {
                        writeStream.write({ end: true });
                        const tg = new ThumbnailGenerator({
                            sourcePath: uploadPath + file.originalname,
                            thumbnailPath: thumbnailPath
                        });
                        await tg.generateOneByPercent(1);
                    });
                });

                return {
                    url: `http://localhost:3000/${uploadPath}${file.originalname}`
                };
            })
        );
        res.status(200).json({ files: fileResult });
    }
}

module.exports = { VideoController };
