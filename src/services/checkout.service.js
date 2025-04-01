'use strict'



class CheckoutService{


  
    /*
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


          ]
        }
    */

    static async checkoutReview ({
      cart_id, user_id, shop_order_ids
    }) {

    }
}

module.exports = CheckoutService