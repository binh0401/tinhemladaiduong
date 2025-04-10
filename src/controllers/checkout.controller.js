'use strict'

const {OK} = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')

class CheckoutController{

    checkoutReview = async(req,res,next) => {
        const {cart_id, user_id, shop_order_ids} = req.body
        new OK({
          message: 'Check out review success',
          metadata: await CheckoutService.checkoutReview({cart_id, user_id, shop_order_ids})
        }).send(res)
    }

    
}

module.exports = new CheckoutController()