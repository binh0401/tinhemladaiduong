'use strict'
import { convertToObjectId } from '../../utils/index.js'
import inventory from '../inventory.model.js'


const insertInventory = async({
  productId, location='unknown', stock, shopId
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId
  })
}

const reservedInventory = async({product_id, quantity, cart_id}) => {
  const query = {
    inven_productId: convertToObjectId(product_id),
    inven_stock: {$gte: quantity}
  }

  const update = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: {
        quantity,
        cart_id,
        createdOn: new Date()
      }
    }
  }

  const options = {
    upsert: true,
    new: true
  }

  return await inventory.updateOne(query, update, options)
}

export {insertInventory, reservedInventory}