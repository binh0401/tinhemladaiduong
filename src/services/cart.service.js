'use strict'
const {BadRequestError, NotFoundError} = require('../core/error.response')
const {cart} = require('../models/cart.model')
/*

  1, Add product to cart : User
     Create new cart : User
  2, Reduce product quantity: User
  3, Increase product quantity: User
  4, Get products of cart: User
  5, Delete cart: User
  6, Delete cart item: User
*/

/*
{
  product_id,
  shop_id,
  quantity,
  name,
  price        
 }
*/


class CartService{

  //1

  static async addToCart({user_id, product = {} }){
      
    const userCart = await cart.findOne({
      cart_user_id: user_id,
      cart_state: 'active'
    })

    //No cart
    if(!userCart){
      //create a cart for user
      return await cart.create({
        cart_state: 'active',
        cart_products: [product],
        cart_count_product : product.quantity,
        cart_user_id: user_id
      })
    }

    //already had a cart:
    const {product_id, quantity} = product
    //1. No product in cart
    if(!userCart.cart_count_product){
      userCart.cart_products = [product]
      userCart.cart_count_product = quantity
    }else{
    //2. Already have product in cart
      
      userCart.cart_count_product += quantity
      const existingProduct = userCart.cart_products.find(product => product.product_id === product_id)

      if(!existingProduct){
        userCart.cart_products.push(product)
      }else{
        existingProduct.quantity += quantity
      }
    }
    return await userCart.save() 
  }


  //2
  static async reduceCart({}){

  }

  //3
  static async increaseCart({}){

  }

}

module.exports = CartService
