'use strict'

const DiscountService = require('../services/discount.service')
const {OK, CREATED} = require('../core/success.response')

class DiscountController{

  //1. Create new discount code: Shop | Admin
  createDiscountCode = async(req,res,next) => {
    const payload = req.body
    const shop_id = req.user.userId
    new CREATED({
      message:'Create new discount code success',
      metadata: await DiscountService.createDiscountCode(payload, shop_id)
    }).send(res)
  }

  //2. Update discount code: Shop | Admin
  updateDiscountCode = async(req,res,next) => {
    const payload = req.body
    const shop_id = req.user.userId
    const discountId = req.params.discount_id
    new OK({
      message: 'Update discount code success',
      metadata: await DiscountService.updateDiscountCode(discountId, payload, shop_id)
    }).send(res)
  }

  //3. get all products available with discount: User
  getAllProductsWithDiscountByPublic = async(req,res,next) => {
    const shop_id = req.params.shop_id
    const code = req.body.code
    // console.log(shop_id, code)
    const payload = {...req.query, code, shop_id}
    new OK({
      message: 'Get all products with discount of shop success',
      metadata: await DiscountService.getAllProductsWithDiscountByPublic(payload)
    }).send(res)

  }

  //4. get all discount codes of a shop: User | Shop
  getAllDiscountsOfShopByPublic = async(req,res,next) => {
    const shop_id = req.params.shop_id
    const payload = {...req.query, shop_id}
    new OK({
      message: 'Get all discounts of shop success',
      metadata: await DiscountService.getAllDiscountsOfShopByPublic(payload)
    }).send(res)
  }
  //5. verify discount code from user: User
  getDiscountAmount = async(req,res,next) => {
    const {code, shop_id, user_id, products} = req.body
    new OK({
      message: 'Apply discount success',
      metadata: await DiscountService.getDiscountAmount({code, shop_id, user_id, products})
    }).send(res)
  }

  //6. delete discount code of a shop: Shop | Admin
  deleteDiscountCode = async(req,res,next) => {
    const code = req.params.code
    const shop_id = req.user.userId
    return new OK({
      message: 'Delete discount code success',
      metadata: await DiscountService.deleteDiscountCode({shop_id, code})
    }).send(res)
  }

  //7. cancel discount code: User
  cancelDiscountCode = async(req,res, next) => {
    new OK({
      message: 'Cancel discount success',
      metadata: await DiscountService.cancelDiscountCode({})
    }).send(res)
  }
}

module.exports = new DiscountController()