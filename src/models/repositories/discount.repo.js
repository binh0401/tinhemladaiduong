const {discount} = require('../discount.model')
const {BadRequestError} = require('../../core/error.response')


const updateDiscount = async (discountId, payload, shop_id) => {
  const updateDiscount = await discount.findOne({_id: discountId})

  if(updateDiscount.discount_shopId !== shop_id){
    throw new BadRequestError("You can not update other shop's discount")
  }

  return await discount.findByIdAndUpdate(discountId, payload, {new: isNew })
}

module.exports = {
  updateDiscount
}