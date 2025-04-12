import mongoose from 'mongoose'; 

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

/*
  order_checkout = {
    total_price,
    fee_ship,
    total_discount,
    total_checkout
  }
*/

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    order_user_id: {
      type: Number,
      required: true
    },

    order_checkout:{                     
      type: Object,
      default: {}
    },

    order_shipping:{
      type: Object,
      default: {}
    },

    /*
        street,
        city,
        state,
        country
    */
   order_payment: {
    type: Object,
    default: {}
   },

   order_products: {
    type: Array,
    required: true
   },

   order_tracking: {
    type: String,
    default: "#000010042025"
   },
   order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
    default: 'pending'
   }
},{
  collection: COLLECTION_NAME,
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'modifiedOn'
  }
});

//Export the model
export default {order: mongoose.model(DOCUMENT_NAME, orderSchema)}