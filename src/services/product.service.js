'use strict'

import models from '../models/product.model.js'
import { BadRequestError } from '../core/error.response.js'
import {  publishAProductOfShop, queryProducts, unpublishAProductOfShop, searchProductsByPublic, findAllProductsByPublic, findOneProductByPublic, updateAProductOfShop } from '../models/repositories/product.repo.js'
import { removeNullFields, nestedObjectParser } from '../utils/index.js'
import { insertInventory } from '../models/repositories/inventory.repo.js'
import NotificationService from './notification.service.js'
const { product, clothing, electronic, furniture } = models
//Apply Factory Pattern
class ProductFactory {

  static productRegistry = {} //key-class

  static registerProductType( type, classRef ) {
      ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {   //payload: {shop's payload}
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError('Invalid Product Type', type)

    return new productClass(payload).createProduct()
  }

  //Get a list of shop's draft
  static async findAllDraftsOfShop({product_shop, limit=50, skip=0}){
    const query = {product_shop, isDraft: true }
    return await queryProducts({query, limit, skip})
  }

  //Publish a product from drafts of a shop
  static async publishAProductOfShop({product_shop, product_id}){
    return publishAProductOfShop({product_shop, product_id})
  }
  
  //Get a list of shop's published
  static async findAllPublishedOfShop({product_shop, limit=50, skip=0}){
    const query = {product_shop, isPublished: true}
    return await queryProducts({query, limit, skip})
  }

  //Unpublish a product of a shop
  static async unpublishAProductOfShop({product_shop, product_id}){
    return await unpublishAProductOfShop({product_shop, product_id})
  }

  //Search products by public, only search published products
  static async searchProductsByPublic({keySearch}){
      return await searchProductsByPublic({keySearch})
  }

  //Get all products by public, only get published products
  static async findAllProductsByPublic({limit=50, sort='ctime', page=1, filter={isPublished: true}}){
      return await findAllProductsByPublic({limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
  }

  //Get 1 product by public, only get published product
  static async findOneProductByPublic({product_id}){
    return await findOneProductByPublic({product_id, unSelect : ['__v']})
  }

  //Update 1 product of shop
  static async updateAProductOfShop(type, payload, productId){
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError('Invalid Product Type', type)

    return new productClass(payload).updateAProductOfShop(productId)
  }
  
}

class Product {
  constructor({
    product_name, product_thumb, product_description,
    product_price, product_quantity, product_type, product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  //create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId })

    if(newProduct){
      //add into inventory
      await insertInventory({
        productId,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    //Push Noti to DB after create a product
    await NotificationService.pushNotiToDB({
      type: "SHOP-001",
      receiver_id: 1,
      sender_id: this.product_shop,
      options: {
        product_name: this.product_name,
        shop_name: this.shop_name
      }
    })

    return newProduct
  }

  //update the product
  async updateProduct(productId, payload){
    return await updateAProductOfShop({productId, payload, model: product})
  }

}

//Sub-class for clothing
class Clothing extends Product {

  //automatically call constructor of Products
  //Or we can explicitly define a constructor
  // constructor(payload){
  //   super(payload)
  // }

  //create new product detail
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new Clothing Error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }

  //update product detail
  async updateAProductOfShop(productId) {
      //1. Remove fields: null or undefined
      //2. Check how to update: if has attribute -> both product db and detail db, if not -> just product db

      const cleanedObject = removeNullFields(this)
      const parsedObject = nestedObjectParser(cleanedObject)
      
        if(cleanedObject.product_attributes){
          //update detail db
          await updateAProductOfShop({productId, payload: cleanedObject.product_attributes , model: clothing})
        }
  
        const updateProduct = await super.updateProduct(productId, parsedObject)
        return updateProduct

  }
}

//Sub-class for electronic
class Electronic extends Product {

  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronic Error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product Error')

    return newProduct
  }

  async updateAProductOfShop(productId) {
    //1. Remove fields: null or undefined
    //2. Check how to update: if has attribute -> both product db and detail db, if not -> just product db

    
    const cleanedObject = removeNullFields(this)
    const parsedObject = nestedObjectParser(cleanedObject)
    
      if(cleanedObject.product_attributes){
        //update detail db
        await updateAProductOfShop({productId, payload: cleanedObject.product_attributes , model: electronic})
      }

      const updateProduct = await super.updateProduct(productId, parsedObject)
      return updateProduct

}
}

//Sub-class for furniture
class Furniture extends Product {

  async createProduct (){
    const newFurniture = await furniture.create({
        ...this.product_attributes,
        product_shop: this.product_shop
    })
    if(!newFurniture) throw new BadRequestError('Create new Furniture Error')

    const newProduct = super.createProduct(newFurniture._id)
    if(!newProduct) throw new BadRequestError('Create new Product Error')
    
    return newProduct
  }

  async updateAProductOfShop(productId) {
    //1. Remove fields: null or undefined
    //2. Check how to update: if has attribute -> both product db and detail db, if not -> just product db
    
    
    const cleanedObject = removeNullFields(this)
    const parsedObject = nestedObjectParser(cleanedObject)
    
      if(cleanedObject.product_attributes){
        //update detail db
        await updateAProductOfShop({productId, payload: cleanedObject.product_attributes , model: furniture})
      }

      const updateProduct = await super.updateProduct(productId, parsedObject)
      return updateProduct

}
}


//register product types:
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)
//

export default ProductFactory

