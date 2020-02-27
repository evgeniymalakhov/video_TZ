const multerConfiguration = require('../config/multer-configuration');

module.exports = (req, res, next) => {
    const multerConfig = multerConfiguration.getMulterConfiguration();
    multerConfig(req, res, err => {
        if (err) {
            return res.status(err.status || 500).json({
                error: err.message
            });
        }
        next();
    });
};
