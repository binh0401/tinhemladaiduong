'use strict'

import cartModel from '../cart.model.js'
import {convertToObjectId} from '../../utils/index.js'
const cart = {cartModel}
const findCartById = async(cart_id) => {
  return await cart.findOne({
    _id: convertToObjectId(cart_id),
    cart_state: 'active'
  }).lean()
}



export {
    findCartById
}