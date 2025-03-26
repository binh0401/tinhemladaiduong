'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const discountController = require('../../controllers/discount.controller')
const {authentication} = require('../../auth/authUtils')

const router = express.Router()


////AUTHENTICATION///
router.use(authentication)
/////////////////////

//Create new discount code
router.post('/create', asyncHandler(discountController.createDiscountCode))

//Update discount code
router.patch('/:id', asyncHandler(discountController.updateDiscountCode))




module.exports = router