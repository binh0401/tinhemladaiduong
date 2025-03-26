'use strict'

const DiscountService = require('../services/discount.service')
const {OK, CREATED} = require('../core/success.response')

class DiscountController{

  //Create new discount code
  createDiscountCode = async(req,res,next) => {
    const payload = req.body
    const shop_id = req.user.userId
    new CREATED({
      message:'Create new discount code success',
      metadata: await DiscountService.createDiscountCode(payload, shop_id)
    }).send(res)
  }

  //Update discount code
  updateDiscountCode = async(req,res,next) => {
    const payload = req.body
    const shop_id = req.user.userId
    const discountId = req.params.id
    new OK({
      message: 'Update discount code success',
      metadata: await DiscountService.updateDiscountCode(discountId, payload, shop_id)
    }).send(res)
  }

  //get all products available with discount
  getAllProductsWithDiscountByPublic = async(req,res,next) => {
    const shop_id = req.params.id
    const code = req.params.code
    const payload = {...req.query, code, shop_id}
    new OK({
      message: 'Get all products with discount of shop success',
      metadata: await DiscountService.getAllProductsWithDiscountByPublic(payload)
    }).send(res)

  }

  //get all discount codes of a shop
  getAllDiscountsOfShopByPublic = async(req,res,next) => {
    const shop_id = req.params.id
    const payload = {...req.query, shop_id}
    new OK({
      message: 'Get all discounts of shop success',
      metadata: await DiscountService.getAllDiscountsOfShopByPublic(payload)
    }).send(res)
  }
}

module.exports = DiscountController