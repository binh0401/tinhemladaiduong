'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const {BadRequestError} = require('../core/error.response')
const { checkValidAllProducts } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")


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

    static async checkoutReview ({cart_id, user_id, shop_order_ids = []}) {
        //find the cart
        const foundCart = await findCartById(cart_id)
        if(foundCart) throw new BadRequestError('Cart not found')

        const shop_order_ids_new = []
        const checkout_order = {
          total_price: 0, 
          fee_ship: 0,
          total_discount: 0,
          total_checkout: 0
        }

        
        
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
          
          const items_checkOut = {
              shop_id,
              shop_discounts,
              price_raw: totalPrice,
              price_apply_discounts: totalPrice,
              products: checkedProducts
          }

          if (shop_discounts.length > 0){
            shop_discounts.forEach(async (discount) => {
              const {total = 0, discount = 0} = await getDiscountAmount({
                code: discount.code,
                shop_id: discount.shop_id,
                user_id: user_id,
                products: checkedProducts,
              })
              checkout_order.total_discount += discount
              item_checkOut.price_apply_discounts -= discount
            })
          }
          checkout_order.total_checkout += item_checkOut.price_apply_discounts
          shop_order_ids_new.push(items_checkOut)
        }

        return {
          shop_order_ids,
          shop_order_ids_new,
          checkout_order
        }
    }
}

module.exports = CheckoutService