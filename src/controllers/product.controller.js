'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED } = require('../core/success.response')

class ProductController {

    //Create product
    createProduct = async (req, res, next) => {
      const type = req.body.product_type
      const payload = req.body
      new CREATED({
        message: 'Create product success',
        metadata: await ProductService.createProduct(type, {
          ...payload,
          product_shop: req.user.userId
        })
      }).send(res)
    }

    //QUERY//
    findAllDraftsOfShop = async(req,res,next) => {
      new OK({
        message: 'Find draft product success',
        metadata: await ProductService.findAllDraftsOfShop({product_shop: req.user.userId})
      }).send(res)
    }
    
}


module.exports = new ProductController()