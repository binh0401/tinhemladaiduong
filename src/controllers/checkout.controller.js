'use strict'

import {OK} from '../core/success.response.js'
import CheckoutService from '../services/checkout.service.js';

class CheckoutController{

    checkoutReview = async(req,res,next) => {
        const {cart_id, user_id, shop_order_ids} = req.body
        new OK({
          message: 'Check out review success',
          metadata: await CheckoutService.checkoutReview({cart_id, user_id, shop_order_ids})
        }).send(res)
    }

    
}

export default new CheckoutController()