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

///////QUERY//////
//query all draft products of user
router.get('/drafts/all', asyncHandler(productController.findAllDraftsOfShop))
//query all published products of user
router.get('/published/all', asyncHandler(productController.findAllPublishedOfShop))
/////////////////

//Publish a product from drafts
router.post('/publish/:id', asyncHandler(productController.publishAProductOfShop))

//Unpublish a product 
router.post('/unpublish/:id', asyncHandler(productController.unpublishAProductOfShop))

module.exports = router