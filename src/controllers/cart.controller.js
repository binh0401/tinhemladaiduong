'use strict'
const {OK, CREATED} = require('../core/success.response')
const CartService = require('../services/cart.service')

class CartController {
    //1.
    addToCart = async (req,res,next) => {
      const user_id = req.params.userId
      const product = req.body
      new CREATED({
        message: 'Add product to cart success',
        metadata: await CartService.addToCart({user_id, product})
      }).send(res)
    }

    //2
    updateCart = async(req,res,next) => {
      const user_id = req.params.userId
      const {shop_order_ids} = req.body
      new OK({
        message: 'Update cart success',
        metadata: await CartService.updateCart({user_id, shop_order_ids})
      }).send(res)
    }

    //3
    deleteProductOfCart = async(req,res,next) => {
      const user_id = req.params.userId
      const product_id = req.body
      new OK({
        message: 'Delete product in cart success',
        metadata: await CartService.deleteProductOfCart({user_id, product_id})
      }).send(res)
    }

    //4
    getProductsInCart = async(req,res,next) => {
      const user_id = req.params.userId 
      new OK({
        message: 'Get products in cart success',
        metadata: await CartService.getProductsInCart({user_id})
      }).send(res)
    }

    //5
    deleteAllCart = async(req,res,next) => {
      const user_id = req.params.userId 
      new OK({
        message: 'Get products in cart success',
        metadata: await CartService.deleteAllCart({user_id})
      }).send(res)
    }
}

module.exports = new CartController()