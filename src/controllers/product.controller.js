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

    //Get all drafts of a shop
    findAllDraftsOfShop = async(req,res,next) => {
      new OK({
        message: 'Find all draft products success',
        metadata: await ProductService.findAllDraftsOfShop({product_shop: req.user.userId})
      }).send(res)
    }
    
    //Publish a product from drafts
    publishAProductOfShop = async(req,res,next) => {
      new OK({
        message: 'Publish a product from draft success',
        metadata: await ProductService.publishAProductOfShop({
          product_shop: req.user.userId,
          product_id: req.params.id})
      }).send(res)
    }

    //Get all published of a shop
    findAllPublishedOfShop = async(req,res,next) => {
      new OK({
        message: 'Find all published products success',
        metadata: await ProductService.findAllPublishedOfShop({product_shop: req.user.userId})
      }).send(res)
    }

    //Unpublish a product of shop
    unpublishAProductOfShop = async(req,res,next) => {
      new OK({
        message: 'Unpublish a product success',
        metadata: await ProductService.unpublishAProductOfShop({
          product_shop: req.user.userId,
          product_id: req.params.id})
      }).send(res)
    }

    //Search products by public
    searchProductsByPublic = async(req,res,next) => {
      new OK({
        message: 'Search product by public success',
        metadata: await ProductService.searchProductsByPublic(req.params)
      }).send(res)
    }

    
}


module.exports = new ProductController()