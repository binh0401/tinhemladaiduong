'use strict'

const express = require('express')
const router = express.Router()
const accessRoutes = require('./access/index.js')
const productRoutes = require('./product/index.js')
const discountRoutes = require('./discount/index.js')
const cartRoutes = require('./cart/index.js')
const { apiKey, permission } = require('../auth/checkAuth.js')

// check apiKey
router.use(apiKey)
//check permission
router.use(permission('0000'))




router.use('/v1/api/product', productRoutes)
router.use('/v1/api/shop', accessRoutes)
router.use('/v1/api/discount', discountRoutes)
router.use('/v1/api/cart', cartRoutes)
module.exports = router