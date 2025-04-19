import express from 'express'
import {authentication} from '../../auth/authUtils.js'
import asyncHandler from '../../helpers/asyncHandler.js'
import commentController from '../../controllers/comment.controller.js'
const router = express.Router()

//AUTHENTICATION//
router.use(authentication)
//////////////////

//Create a comment
router.post('', asyncHandler(commentController.createComment))





export default router