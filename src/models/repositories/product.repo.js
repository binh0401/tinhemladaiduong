'use strict'

const { Types } = require("mongoose")
const { product, electronic, furniture, clothing } = require("../product.model")

const publishAProductOfShop = async ({product_shop, product_id}) => {
    
    const foundProduct = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    })

    if(!foundProduct) return null

    const filter = {_id: foundProduct._id}
    const update = {
     $set: {
      isDraft: false,
      isPublished: true
     }     
    }


    const { modifiedCount } = await product.updateOne(filter, update)

    return modifiedCount
    
}

const queryProducts = async({query, limit, skip}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({updatedAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
}


module.exports = {
  queryProducts,
  publishAProductOfShop,
  
}

