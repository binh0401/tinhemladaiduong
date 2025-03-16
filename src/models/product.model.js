'use strict'

const { Types, model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
   product_name: {
    type: String,
    required: true
   },

   product_thumb: {
    type: String,
    required: true
   },

   product_description: {
    type: String
   },

   product_price: {
    type: Number,
    required: true
   },

   product_quantity: {
    type: Number,
    required: true
   },

   product_type: {
    type: String, 
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture']
   },

   product_shop: {
    type: Types.ObjectId,
    ref: 'Shop'
   },

   product_attributes: {
    type: Types.Mixed,
    required: true
   }
},{
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema);