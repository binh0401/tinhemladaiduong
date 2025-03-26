'use strict'
const {BadRequestError, NotFoundError} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const { updateDiscount, getAllDiscountsOfShopByPublicUnselect } = require('../models/repositories/discount.repo')
const { findAllProductsByPublic } = require('../models/repositories/product.repo')
const {convertToObjectId} = require('../utils/index')
/*
1. Generate Discount code (Shop | Admin)
2, Update discount (Shop | Admin)
3. Get discounted products (User)
4. Get all discount codes (User | Shop)
5. Verify discount code (User)
6. Delete discount codes (Shop | Admin)
7. Cancel discount code (User)

*/

class DiscountService{

  //1 create discount
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

  //2 update discount
  static async updateDiscountCode(discountId, payload, shop_id){
    return await updateDiscount(discountId, payload, shop_id)
  }

  //3 get all products available with discount of a shop
  static async getAllProductsWithDiscountByPublic ({code, shop_id, limit=50, page=1}){
      const foundDiscount = discount.findOne({
        discount_code: code,
        discount_shopId: shop_id
      }).lean()

      if(!foundDiscount || !foundDiscount.discount_is_active){
        throw new BadRequestError('Discount not exists')
      }

      //apply to all --> get all products
      //apply to specific --> only return some products

      const {discount_apply_to, discount_product_ids } = foundDiscount

      let products
      if(discount_apply_to === 'all'){
        //get all products of this shop
        products = await findAllProductsByPublic({
          limit: +limit,
          sort: 'ctime',
          page: +page,
          filter : {
            product_shop: convertToObjectId(shop_id),
            isPublished: true
          },
          select: ['product_name']
        })
      }else if(discount_apply_to === 'specific'){
        //get the products of product_ids
        products = await findAllProductsByPublic({
          limit: +limit,
          sort: 'ctime',
          page: +page,
          filter : {
            product_shop: convertToObjectId(shop_id),
            _id: {$in: discount_product_ids},
            isPublished: true
          },
          select: ['product_name']
        })
      }

      return products
  }

  //4 get all discount codes of a shop
  static async getAllDiscountsOfShopByPublic({limit=50, page=1, shop_id}) {
    const discounts = await getAllDiscountsOfShopByPublicUnselect({
    limit: +limit,
    page: +page,
    filter: {
      discount_shopId: convertToObjectId(shop_id),
      discount_is_active: true
    },
    unSelect: ['__v', 'discount_shopId']
    })

    return discounts
  }



}

module.exports = DiscountService
