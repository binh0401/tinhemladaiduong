
import { NotFoundError } from '../core/error.response.js'
import comment from '../models/comment.model.js'
import {convertToObjectId} from '../utils/index.js'
import { findProductById } from '../models/repositories/product.repo.js'
/*
    1, Add comment: User | Shop
    2, Get list of comments: User | Shop
    3, Delete comment: User | Shop | Admin
*/


class CommentService {

    static async createComment({product_id, user_id, content, parent_comment_id=null}){

      const newComment = new comment({
        comment_productId: product_id,
        comment_userId: user_id,
        comment_content: content,
        comment_parentId: parent_comment_id
      })

      
      let left_value
      
      if(parent_comment_id){
        //reply a comment in the product post
        const parent_comment = await comment.findById(parent_comment_id)
        if(!parent_comment) throw new NotFoundError("Replying comment not found")
        
        left_value = parent_comment.comment_right
        
        //Increase everything larger than left_value by 2
        await comment.updateMany({
          comment_right: {
            $gte: left_value
          }
        }, {
          $inc: {comment_right: 2}
        })

        await comment.updateMany({
          comment_left: {
            $gte: left_value
          }
        }, {
          $inc: {
            comment_left: 2
          }
        })
      }else{
        //insert a comment to the product post
        const outer_most_comment = await comment.findOne({
          comment_productId : product_id
        }, 'comment_right', {sort: {comment_right: -1}})

        if(outer_most_comment){
          left_value = 1 + outer_most_comment.comment_right
        }else{
          left_value = 1
        }
      }
      newComment.comment_left = left_value
      newComment.comment_right = left_value + 1
      await newComment.save()
      return newComment



    }

    static async getComments({product_id, parent_comment_id=null, limit=50, skip=0}){

      if(parent_comment_id){
        //Get all reply comments of a parent comment
        const parent_comment = await comment.findById(parent_comment_id)
        if(!parent_comment) throw new NotFoundError('Comment not found')
        
        //Take all comments that left > parent's left && right < parent's right
        const child_comments = await comment.find({
          comment_productId: convertToObjectId(product_id),
          comment_parentId: parent_comment_id,
          comment_left: {$gt: parent_comment.comment_left},
          comment_right: {$lt: parent_comment.comment_right}
        }).sort({
          comment_left: 1
        }).limit(limit).select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1
        })

        return child_comments
      }else{
        //get all level 1 comments from a product post, no parents
        const level1_comments = await comment.find({
          comment_productId: convertToObjectId(product_id),
          comment_parentId: null
        }).sort({
          comment_left: 1
        }).limit(limit).select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
        })

        return level1_comments
      }
    }

    //Delete everything >= left and <= right
    static async deleteComment({comment_id, product_id}){
      const foundProduct = await findProductById(product_id)
      if(!foundProduct) throw new NotFoundError("Product not found")
      
      const foundComment = await comment.findById(comment_id)
      if(!foundComment) throw new NotFoundError("Comment not found")

      const left_value = foundComment.comment_left
      const right_value = foundComment.comment_right
      const offset = right_value - left_value + 1

      await comment.deleteMany({
        comment_productId: product_id,
        comment_left: {$gte: left_value},
        comment_right: {$lte: right_value}
      })

      //update left and right for the rest of comments (left,right > deleted's right)
      await comment.updateMany({
        comment_productId: product_id,
        comment_right: {$gt: right_value}
      },{
        $inc: {comment_right: -offset}
      })

      await comment.updateMany({
        comment_productId: product_id,
        comment_left: {$gt: right_value}
      },{
        $inc: {comment_left: -offset}
      })
      
      return {
        deleted: true,
        deleted_comment: foundComment
      }
    }
}

export default CommentService