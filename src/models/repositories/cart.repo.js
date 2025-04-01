'use strict'

const {cart} = require('../cart.model')
const {convertToObjectId} = require('../../utils/index')

const findCartById = async(cart_id) => {
  return await cart.findOne({
    _id: convertToObjectId(cart_id),
    cart_state: 'active'
  }).lean()
}



module.exports = {
    findCartById
}