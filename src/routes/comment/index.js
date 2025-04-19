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

//Get comments
router.get('', asyncHandler(commentController.getComments))

//Delete comments
router.delete('', asyncHandler(commentController.deleteComment))



export default router