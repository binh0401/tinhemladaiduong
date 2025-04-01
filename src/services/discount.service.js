'use strict'
const {BadRequestError, NotFoundError} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const { updateDiscount, getAllDiscountsOfShopByPublicUnselect, findDiscount } = require('../models/repositories/discount.repo')
const { findAllProductsByPublic } = require('../models/repositories/product.repo')
const {convertToObjectId} = require('../utils/index')
/*
1. Generate Discount code (Shop | Admin)
2, Update discount (Shop | Admin)
3. Get discounted products (User)
4. Get all discount codes (User | Shop)
5. Verify discount code (User)  ===> Need future role based permissions
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
      console.log(code)
      console.log(shopId)
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
      const foundDiscount = await discount.findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shop_id)
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

  //5 Verify discount code from user
  static async getDiscountAmount({code, shop_id, user_id, products}){
    
    /*cart model : [{
      product_id,
      quantity,
      price
    }, { } ...]

    */

    const foundDiscount = await findDiscount({code, shop_id})
    
    if(!foundDiscount) throw new BadRequestError('Discount not exist')

    const {
      discount_is_active,
      discount_uses_all,
      discount_uses_count,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_users,
      discount_users_used,
      discount_type,
      discount_apply_to,
      discount_value,
      discount_product_ids
    } = foundDiscount

    if(!discount_is_active) throw new NotFoundError('Discount expired')
    if(discount_uses_all - discount_uses_count == 0) throw new NotFoundError('All discounts have been used')

    if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new NotFoundError('Discount not found')

    if(discount_min_order_value > 0){
      let totalOrder = 0
      //calculate total price of products
      products.forEach(product => {
        totalOrder += product.quantity + product.price
      });
      if (totalOrder < discount_min_order_value) throw new BadRequestError(`Required at least ${discount_min_order_value} to apply discount`)      
    }

    if(discount_max_uses_per_users > 0){
      let count_used = 0
      discount_users_used.forEach(userId => {
        if(userId === user_id){
          count_used += 1
        }
      })

      if (count_used >= discount_max_uses_per_users) throw new BadRequestError(`You can only use this discount ${discount_max_uses_per_users} times`)
    }

    let totalOrder = 0
    let discountAmount = 0
    if(discount_type === 'fixed_amount'){
      if(discount_apply_to === 'all'){
        products.forEach(product => {
          totalOrder += product.quantity * product.price
          discountAmount += discount_value
        })
      }else if(discount_apply_to === 'specific'){
        products.forEach(product => {
          if(product.product_id in discount_product_ids){
            totalOrder += product.quantity * product.price
            discountAmount += discount_value
          }else{
            totalOrder += product.quantity * product.price
          }
        })
      }
    }else if (discount_type === 'percentage'){
      if(discount_apply_to === 'all'){
        products.forEach(product => {
          totalOrder += product.quantity * product.price 
          discountAmount += product.quantity * product.price * discount_value/100
        })
      }else if(discount_apply_to === 'specific'){
        products.forEach(product => {
          if(product.product_id in discount_product_ids){
            totalOrder += product.quantity * product.price 
            discountAmount += product.quantity * product.price * discount_value/100
          }else{
            totalOrder += product.quantity * product.price
          }
        })
      }
    }

    foundDiscount.discount_users_used.push(user_id)
    foundDiscount.discount_uses_count += 1
    await foundDiscount.save()

    return {
      sub_total: totalOrder,
      discount: discountAmount,
      total: totalOrder - discountAmount
    }

    
  }

  //6 Delete discount code by shop: 2 ways: a flag marked as deleted, or another DB. For now just delete in main DB 
  static async deleteDiscountCode({code, shop_id}){
  
    const foundDiscount = await findDiscount({code, shop_id})
    //Some checking before delete in the future if needed (if discount is being used by some one ...)

    if(!foundDiscount) throw new BadRequestError('Can not delete this discount code')

    const deleteDiscount = await discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectId(shop_id)
    })

    return deleteDiscount
  }

  //7. Cancel a discount by user --> Have not done router
  static async cancelDiscountCode({code, shop_id, user_id}){
    const foundDiscount = await findDiscount({code, shop_id})

    if(!foundDiscount) throw new BadRequestError('Discount code not exist')

    const idx = foundDiscount.discount_users_used.indexOf(user_id)

    if(idx === -1){
      throw new BadRequestError('You can not cancel this discount')
    }
    foundDiscount.discount_users_used.splice(idx, 1)
    foundDiscount.discount_uses_count -= 1
    await foundDiscount.save()

    return foundDiscount
  }

}

module.exports = DiscountService
