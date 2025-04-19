
import { NotFoundError } from '../core/error.response.js'
import comment from '../models/comment.model.js'
import {convertToObjectId} from '../utils/index.js'
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

    
}

export default CommentService