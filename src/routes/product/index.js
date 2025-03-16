'use strict'

const express = require('express')
const {authentication} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const router = express.Router()

///AUTHENTICATION///
router.use(authentication)
////////////////////

router.post('/create', asyncHandler(productController.createProduct))


module.exports = router