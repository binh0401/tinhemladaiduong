'use strict'

import { BadRequestError } from '../core/error.response.js'
import inventoryModel from '../models/inventory.model.js'
import { findProductById } from '../models/repositories/product.repo.js'
import { convertToObjectId } from '../utils/index.js'

const inventory = { inventoryModel }

class InventoryService{
  //1. Add stock to inventory
  static async addStockToInventory({
    stock,
    product_id,
    shop_id,
    location = 'USA'
  }){
      const product = await findProductById(product_id)
      if(!product){
        throw new BadRequestError('Product does not exist')
      }

      const query = {
        inven_productId: convertToObjectId(product_id),
        inven_shopId: convertToObjectId(shop_id)
      }

      const update = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      }

      const options = {
        upsert: true,
        new: true
      }

      return inventory.findOneAndUpdate(query, update, options)
  }

  //2. 
}

export default InventoryService

