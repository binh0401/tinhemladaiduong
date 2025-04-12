'use strict'
import asyncHandler from '../../helpers/asyncHandler.js';
import express from 'express';
import cartController from '../../controllers/cart.controller.js';
const router = express.Router()

//1
router.post('/add/:userId', asyncHandler(cartController.addToCart))

//2
router.post('/update/:userId', asyncHandler(cartController.updateCart))

//3
router.post('/delOne/:userId', asyncHandler(cartController.deleteProductOfCart))

//4
router.get('/all/:userId', asyncHandler(cartController.getProductsInCart))

//5
router.delete('/delAll/:userId', asyncHandler(cartController.deleteAllCart))

export default router