
import express from 'express'
import { authentication } from '../../auth/authUtils.js'
import asyncHander from '../../helpers/asyncHandler.js'
import notificationController from '../../controllers/notification.controller.js'

const router = express.Router()

//AUTHENTICATION///
router.use(authentication)
///////////////////


router.get('', asyncHander(notificationController.getNotiByUser) )


export default router

