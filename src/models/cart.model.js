const {model, Schema} = require('mongoose'); 

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'


const cartSchema = new Schema({
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },

    cart_user_id: {
      type: Number,
      required: true,
    },

    cart_products: {                             
      type: Array,
      required: true,
      default: []
    },

    cart_count_product: {
      type: Number,
      default: 0
    },

    /*
        [
            {
                product_id,
                shop_id,
                quantity,
                name,
                price        
            }
        ]

    */

   

   
},{
  collection: COLLECTION_NAME,
  timeseries: {
    createdAt: 'createdOn',
    updatedAt: 'modifiedOn'
  }
});

//Export the model
module.exports = {cart: model(DOCUMENT_NAME, cartSchema)}