import { CREATED, OK } from "../core/success.response.js"
import CommentService from "../services/comment.service.js"


class CommentController{
    createComment = async (req,res,next) => {
      new CREATED({
        message: "Successfully created comment",
        metadata: await CommentService.createComment(req.body)
      }).send(res)
    }

    getComments = async(req,res,next) => {
      new OK({
        message: "Successfully get comments",
        metadata: await CommentService.getComments(req.query)
      }).send(res)
    }

    deleteComment = async(req,res,next) => {
      new OK({
        message: "Successfully deleted comments",
        metadata: await CommentService.deleteComment(req.body)
      }).send(res)
    }
}



export default new CommentController()