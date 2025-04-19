import mongoose from "mongoose";

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// Declare the Schema of the Mongo model

//Order: success, fail, 
//Promotion: new promotion
//Shop: new product of followed shop, 


const notificationSchema = new mongoose.Schema({
    noti_type: {
      type: String,
      enum: ['ORDER-001','ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      required: true
    },

    noti_sender_id: {
      type: Number,
      required: true
    },

    noti_receiver_id: {
      type: Number,
      required: true
    },

    noti_content: {
      type: String,
      required: true
    },

    noti_options: {
      type: Object,
      default: {}
    }

}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, notificationSchema)