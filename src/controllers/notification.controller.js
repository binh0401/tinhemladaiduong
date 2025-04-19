import { OK } from "../core/success.response.js"
import NotificationService from "../services/notification.service.js"


class NotificationController{

  getNotiByUser = async (req,res,next) => {
    new OK({
      message: "Get notifications success",
      metadata: await NotificationService.getNotiByUser(req.body)
    }).send(res)
  }
}

export default new NotificationController()