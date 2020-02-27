const multer = require('multer');
const config = require('./config');

function getMulterConfiguration() {
    const multerConfig = {
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            const isFileTypeAllowed = config.supportedTypes.includes(file.mimetype);
            const error = isFileTypeAllowed ? null : new Error('File unsupported mimetype');
            cb(error, isFileTypeAllowed);
        }
    };

    return multer(multerConfig).fields(config.multer.fields);
}

module.exports.getMulterConfiguration = getMulterConfiguration;
