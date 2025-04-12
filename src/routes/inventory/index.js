'use strict'
import {authentication} from '../../auth/authUtils.js'
import asyncHandler from '../../helpers/asyncHandler.js';
import express from 'express';
import inventoryController from '../../controllers/inventory.controller.js';
const router = express.Router()



router.use(authentication)
router.post('', asyncHandler(inventoryController.addStockToInventory))




export default router