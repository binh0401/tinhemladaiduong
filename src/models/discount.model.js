'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'


// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: { //name of discount
      type: String,
      required: true
    },

    discount_description: { //description
      type: String,
      required: true
    },

    discount_type: {//fixed_amount, percentage
      type: String,
      default: 'fixed_amount'
    },

    discount_value: { //value of discount
      type: Number,
      required: true
    },

    discount_code: { //code of discount for user to enter
      type: String,
      required: true
    },

    discount_start_date: { //start date
      type: Date,
      required: true
    },

    discount_end_date: { //end date
      type: Date,
      required: true
    },

    discount_uses_all: { //number of discount slots 
      type: Number,
      required: true
    },

    discount_uses_count:{//how many discounts have been used
      type: Number,
      required: true
    },

    discount_users_used: {//which users used this discount
      type: Array,
      default: []
    },

    discount_max_uses_per_users: { //maximum number of this discount for each user
      type: Number,
      required: true
    },

    discount_min_order_value: { //whats the min price of order to apply discount
      type: Number,
      required: true,
    },

    discount_shopId:{ //which shop provide this discount
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },

    discount_is_active: { //active/inactive
      type: Boolean,
      default: true
    },

    discount_apply_to: { //discount apply to all products or just some ?
      type: String,
      required: true,
      enum: ['all', 'specific']
    },

    discount_product_ids:{ //Apply to which product (if 'specific')
      type: Array,
      default: []
    }
},
{
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = {discount: model(DOCUMENT_NAME, discountSchema)}