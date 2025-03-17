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

const unpublishAProductOfShop = async({product_shop, product_id}) => {
    const foundProduct = await product.findOne({
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop) 
    })

    if(!foundProduct) return null

    const filter = {
      _id: foundProduct._id
    }

    const update = {
      $set: {
        isDraft: true,
        isPublished: false
      }
    }

    const {modifiedCount} = await product.updateOne(filter, update)
    return modifiedCount
}

const searchProductsByPublic = async({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: {$search: regexSearch}},
        {score: {$meta: 'textScore'}}
    ).sort({score: {$meta: 'textScore'}}).lean()

    return results
}

module.exports = {
  queryProducts,
  publishAProductOfShop,
  unpublishAProductOfShop,
  searchProductsByPublic
  
}

