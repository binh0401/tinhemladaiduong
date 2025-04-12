'use strict'

import express from 'express';
import asyncHandler from '../../helpers/asyncHandler.js'
import checkoutController from '../../controllers/checkout.controller.js'
const router = express.Router()



router.post('/review', asyncHandler(checkoutController.checkoutReview))


export default router