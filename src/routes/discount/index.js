'use strict'

import express from 'express';
import asyncHandler from '../../helpers/asyncHandler.js';
import discountController from '../../controllers/discount.controller.js';
import {authentication} from '../../auth/authUtils.js'

const router = express.Router()

router.post('/apply', asyncHandler(discountController.getDiscountAmount))


//QUERY

//get all products available with discount of a shop by public
router.get('/products/:shop_id', asyncHandler(discountController.getAllProductsWithDiscountByPublic))

//get all discount codes of a shop
router.get('/:shop_id', asyncHandler(discountController.getAllDiscountsOfShopByPublic))

////AUTHENTICATION///
router.use(authentication)
/////////////////////

//Create new discount code
router.post('/create', asyncHandler(discountController.createDiscountCode))

//Update discount code
router.patch('/:discount_id', asyncHandler(discountController.updateDiscountCode))

//Delete discount code
router.delete('/delete/:code', asyncHandler(discountController.deleteDiscountCode))





export default router