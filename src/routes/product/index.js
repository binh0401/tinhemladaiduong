'use strict'

const express = require('express')
const {authentication} = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const router = express.Router()

///AUTHENTICATION///
router.use(authentication)
////////////////////

//create new product
router.post('/create', asyncHandler(productController.createProduct))

//query all draft products of user
router.get('/drafts/all', asyncHandler(productController.findAllDraftsOfShop))

module.exports = router