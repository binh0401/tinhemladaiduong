'use strict'

import express from 'express';
const router = express.Router()
import accessRoutes from './access/index.js';
import productRoutes from './product/index.js';
import discountRoutes from './discount/index.js';
import cartRoutes from './cart/index.js';
import checkoutRoutes from './checkout/index.js';
import inventoryRoutes from './inventory/index.js';
import commentRoutes from './comment/index.js'
import notificationRoutes from './notification/index.js'
import uploadRoutes from './cloudinary/index.js'
import { apiKey, permission } from '../auth/checkAuth.js'
// import {sendToDiscord} from '../middlewares/index.js'

//Discord logger
//router.use(sendToDiscord)


// check apiKey
router.use(apiKey)
//check permission
router.use(permission('0000'))






router.use('/v1/api/inventory', inventoryRoutes)
router.use('/v1/api/product', productRoutes)
router.use('/v1/api/shop', accessRoutes)
router.use('/v1/api/discount', discountRoutes)
router.use('/v1/api/cart', cartRoutes)
router.use('/v1/api/checkout', checkoutRoutes)
router.use('/v1/api/comment', commentRoutes)
router.use('/v1/api/notification', notificationRoutes)
router.use('/v1/api/upload', uploadRoutes)

export default router