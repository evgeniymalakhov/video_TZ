module.exports = {
    uploadPath: './assets/videos/',
    thumbnailPath: './assets/thumbnails/',
    supportedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    multer: {
        limits: {
            fileSize: 10485760
        },
        fields: [{ name: 'videos' }],
        docsPerUpload: 5
    }
};
