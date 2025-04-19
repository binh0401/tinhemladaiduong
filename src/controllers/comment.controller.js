import { CREATED } from "../core/success.response.js"
import CommentService from "../services/comment.service.js"


class CommentController{
    createComment = async (req,res,next) => {
      new CREATED({
        message: "Successfully created comment",
        metadata: await CommentService.createComment(req.body)
      }).send(res)
    }
}



export default new CommentController()