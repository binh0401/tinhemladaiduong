'use strict'

import discountModel from '../discount.model.js'
import {BadRequestError} from '../../core/error.response.js'
import { convertUnselectData, convertSelectData, convertToObjectId } from'../../utils/index.js'

const discount = {discountModel}

const updateDiscount = async (discountId, payload, shop_id) => {
  const updateDiscount = await discount.findOne({_id: discountId})
  if(!updateDiscount) throw new BadRequestError('Discount not exists')

  if(updateDiscount.discount_shopId.toString() !== shop_id){
    throw new BadRequestError("You can not update other shop's discount")
  }

  return await discount.findByIdAndUpdate(discountId, payload, {new: true})
}

const getAllDiscountsOfShopByPublicUnselect = async ({limit = 50, sort = 'ctime', page=1, filter, unSelect}) => {

    const skip = (page-1)*limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const foundDiscounts = 
    await discount.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(convertUnselectData(unSelect))
    .lean()

    return foundDiscounts

}

const getAllDiscountsOfShopByPublicSelect = async ({limit = 50, sort = 'ctime', page=1, filter, select}) => {

  const skip = (page-1)*limit
  const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
  const foundDiscounts = 
  await discount.find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(convertSelectData(select))
  .lean()

  return foundDiscounts

}

const findDiscount = async ({code, shop_id}) => {
  return await discount.findOne({
    discount_code: code,
    discount_shopId: convertToObjectId(shop_id)
  })
}

export {
  updateDiscount,
  getAllDiscountsOfShopByPublicUnselect,
  getAllDiscountsOfShopByPublicSelect,
  findDiscount
}