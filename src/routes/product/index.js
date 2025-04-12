'use strict'

import express from 'express';
import {authentication} from '../../auth/authUtils.js'
import asyncHandler from '../../helpers/asyncHandler.js';
import productController from '../../controllers/product.controller.js';
const router = express.Router()

//Search products by public
router.get('/search/:keySearch', asyncHandler(productController.searchProductsByPublic))

//Get all products by public, only get published products
router.get('', asyncHandler(productController.findAllProductsByPublic))

//Get 1 product by public, only get published product
router.get('/:id', asyncHandler(productController.findOneProductByPublic))

///AUTHENTICATION///
router.use(authentication)
////////////////////

//update a product of shop
router.patch('/:id', asyncHandler(productController.updateAProductOfShop))

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

export default router