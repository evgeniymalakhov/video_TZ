const router = require('express').Router()
const { VideoController } = require('../controllers/video')
const videoTypeMiddleware = require('../middlwares/fileType')

router.get('/', VideoController.getList)
router.post('/', [videoTypeMiddleware], VideoController.uploadVideo)
router.get('/:video', VideoController.getVideo)

module.exports = router