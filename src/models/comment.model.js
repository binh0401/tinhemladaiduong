import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

const commmentSchema = new mongoose.Schema({
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    comment_userId: {
      type: Number,
      default: 1
    },

    comment_content: {
      type: String,
      default: 'text'
    },
    comment_left: {
      type: Number,
      default: 0
    },
    comment_right: {
      type: Number,
      default: 0
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
    },
    idDeleted: {
      type: Boolean,
      default: false
    }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, commmentSchema)