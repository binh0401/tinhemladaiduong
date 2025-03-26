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
}

module.exports = DiscountController