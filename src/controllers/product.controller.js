'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED } = require('../core/success.response')

class ProductController {
  
    createProduct = async (req, res, next) => {
      new CREATED({
        message: 'Create product success',
        metadata: await ProductService
      }).send(res)
    }
}


module.exports = ProductController()