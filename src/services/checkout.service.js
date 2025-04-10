'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const {BadRequestError} = require('../core/error.response')
const { checkValidAllProducts } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const {order} = require('../models/order.model')

class CheckoutService{



    /*
      //shop_order_ids: contain products grouped by each shop
        {
          cart_id,
          user_id,
          shop_order_ids: [
            {
              shop_id,
              shop_discounts: [
                  {
                    shop_id,
                    discount_id,
                    code
                  }
              ],
              products: [
                  {
                    price,
                    quantity, 
                    product_id
                  }
              ]
            },
            ....
          ]
        }
    */

    //1. Server send the final checked data from cart to user
    static async checkoutReview ({cart_id, user_id, shop_order_ids = []}) {
        //find the cart
        const foundCart = await findCartById(cart_id)
        if(!foundCart) throw new BadRequestError('Cart not found')

        const shop_order_ids_new = []
        const checkout_order = {
          total_price: 0, 
          fee_ship: 0,
          total_discount: 0,
          total_checkout: 0
        }

         //group of products for each shop
        for (let i=0;i<shop_order_ids.length; i++){
          const {shop_id, shop_discounts, products} = shop_order_ids[i]

          //check if ALL the products are valid
          const checkedProducts = await checkValidAllProducts(products)
          if(!checkedProducts) throw new BadRequestError('Wrong order')
          
          //calculate total price
          const totalPrice = checkedProducts.reduce((acc, product) => {
            return acc + (product.quantity * product.price) 
          },0)

          checkout_order.total_price += totalPrice
          
          //Items of only this shop
          let items_checkOut = {
              shop_id,
              shop_discounts,
              price_raw: totalPrice,
              price_apply_discounts: totalPrice,
              products: checkedProducts
          }

          if (shop_discounts.length > 0){
            for (const discount of shop_discounts){
              const checkout_info = await getDiscountAmount({
                code: discount.code,
                shop_id: discount.shop_id,
                user_id: user_id,
                products: checkedProducts,
              })
              // console.log(checkout_info.discount)
              checkout_order.total_discount += checkout_info.discount
              items_checkOut.price_apply_discounts -= checkout_info.discount 
            }
          }
          
          checkout_order.total_checkout += items_checkOut.price_apply_discounts
          shop_order_ids_new.push(items_checkOut)
        }

        return {
          shop_order_ids,
          shop_order_ids_new,
          checkout_order
        }
    }

    //2. User place order
    static async placeOrderByUser({
      shop_order_ids,
      cart_id,
      user_id,
      user_address,
      user_payment
    }) {
      //Re-calculate the cart
      const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({cart_id, user_id, shop_order_ids})

      // Check the products if satisfy the inventory
      const products = shop_order_ids_new.flatMap(shop => shop.products)

      const processedProducts = []

      for(let i = 0; i < products.length; i++){
        const {product_id, quantity} = products[i]
        const key = await acquireLock(product_id, quantity, cart_id )
        processedProducts.push(key ? true : false)
      }

      if(processedProducts.includes(false)){
        throw new BadRequestError('Some products have been updated, please return to your cart')
      }

      const newOrder = order.create({
        order_user_id: user_id,
        order_checkout: checkout_order,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new,
      })


      //If insert successfully: remove product in user cart
      if(newOrder){
        
      }

    }

    
}

module.exports = CheckoutService