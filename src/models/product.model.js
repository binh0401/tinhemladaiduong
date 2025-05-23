'use strict'

import { model, Schema } from 'mongoose'
import slugify from 'slugify';
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
   product_name: { //a b c d
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
    enum: ['Electronic', 'Clothing', 'Furniture']
   },

   product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
   },

   product_attributes: {
    type: Schema.Types.Mixed,
    required: true
   },

   //More features:
   product_slug: { //a-b-c-d
    type: String
   },

   product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    //rounding
    set: (val) => Math.round(val*10) / 10
   },

   product_variations: {
    type: Array,
    default: []
   },

   isDraft: {  //findOne wont consider this field
    type: Boolean,
    default: true,
    index: true,
    select: false 
   },

   isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false
   }


},{
  collection: COLLECTION_NAME,
  timestamps: true
});

//Create index for search
productSchema.index({product_name: 'text', product_description: 'text'})
// Document middleware: runs before .save() and .create(): WebHook
productSchema.pre('save', function(next){
  this.product_slug = slugify(this.product_name, {lower: true})
  next()
})


const clothingSchema = new Schema({
  brand: {
    type: String, 
    required: true
  },

  size: {
    type: String
  },

  material: {
    type: String
  },

  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
},{
  collection: 'Clothings',
  timestamps: true
})


const electronicSchema = new Schema({
  manufacturer: {
    type: String, 
    required: true
  },

  model: {
    type: String
  },

  color: {
    type: String
  },

  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
},{
  collection: 'Electronics',
  timestamps: true
})

const furnitureSchema = new Schema({
  brand: {
    type: String, 
    required: true
  },
  size: {
    type: String
  },
  material: {
    type: String
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
},{
  collection: 'Furnitures',
  timestamps: true
})



//Export the model
export default {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronic', electronicSchema),
  furniture: model('Furniture', furnitureSchema)
}