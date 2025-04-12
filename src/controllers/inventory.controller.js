'use strict'
import {CREATED} from '../core/success.response.js'
import InventoryService from '../services/inventory.service.js';

class InventoryController {
    addStockToInventory = async(req,res,next) => {
      new CREATED({
        message: 'Add stock to inventory success',
        metadata: await InventoryService.addStockToInventory(req.body)
      }).send(res)
    }
}

export default new InventoryController()