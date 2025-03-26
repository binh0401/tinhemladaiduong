'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const discountController = require('../../controllers/discount.controller')
const {authentication} = require('../../auth/authUtils')

const router = express.Router()

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





module.exports = router