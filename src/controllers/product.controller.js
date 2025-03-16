'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED } = require('../core/success.response')

class ProductController {
  
    createProduct = async (req, res, next) => {
      const type = req.body.product_type
      const payload = req.body
      new CREATED({
        message: 'Create product success',
        metadata: await ProductService.createProduct(type, payload)
      }).send(res)
    }
    
}


module.exports = new ProductController()