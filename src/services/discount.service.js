'use strict'
const {BadRequestError, NotFoundError} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const { updateDiscount } = require('../models/repositories/discount.repo')
const {convertToObjectId} = require('../utils/index')
/*
1. Generate Discount code (Shop | Admin)
2. Get discount amount (User)
3. Get all discount codes (User | Shop)
4. Verify discount code (User)
5. Delete discount codes (Shop | Admin)
6. Cancel discount code (User)

*/

class DiscountService{

  //1
  static async createDiscountCode(payload, shop_id){
      const {
        name, description, type, value, code, start_date,
        end_date, uses_all, uses_count, users_used, max_uses_per_users, min_order_value,
        shopId, is_active, apply_to, product_ids
      } = payload

      //Check if shop id is the shop creating new discount
      if(shopId !== shop_id){
        throw new BadRequestError("You can not update other shop's discount")
      }

      //check data
      if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
        throw new BadRequestError('Discount code has been expired')
      }

      if(new Date(start_date) >= new Date(end_date)){
        throw new BadRequestError('Start date must be before end date')
      }


      //Create discount code
      const foundDiscount = await discount.findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }).lean()

      if(foundDiscount){
        throw new BadRequestError('Discount exists')
      }

      const newDiscount = await discount.create({
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_code: code,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_uses_all: uses_all,
        discount_uses_count: uses_count,
        discount_users_used: users_used,
        discount_max_uses_per_users: max_uses_per_users,
        discount_min_order_value: min_order_value || 0,
        discount_shopId: shopId,
        discount_is_active: is_active,
        discount_apply_to: apply_to,
        discount_product_ids: apply_to === 'all' ? [] : product_ids
      })

      return newDiscount
  }

  static async updateDiscountCode(discountId, payload, shop_id){
    return await updateDiscount(discountId, payload, shop_id)
  }

}

module.exports = DiscountService
