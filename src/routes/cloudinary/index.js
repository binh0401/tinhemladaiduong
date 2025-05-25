import express from 'express'
import asyncHandler from '../../helpers/asyncHandler.js'
import UploadController from '../../controllers/cloudinaryUpload.controller.js'
import { authentication } from '../../auth/authUtils.js'
import {uploadDisk} from '../../configs/multer.config.js'
const router = express.Router()

router.use(authentication)



router.post('/product', asyncHandler(UploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file') ,asyncHandler(UploadController.uploadFileFromLocal))


export default router