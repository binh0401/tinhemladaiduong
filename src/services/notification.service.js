import notification from '../models/notification.model.js'

class NotificationService {

    static async pushNotiToDB({type = 'SHOP-001', receiver_id = 1, sender_id = 1, options = {}}){
      let noti_content
      if(type === 'SHOP-001'){
        noti_content = 'Just added a product'
      }else if (type === 'PROMOTION-001'){
        noti_content = 'Just added a discount voucher'
      }

      const newNoti = await notification.create({
        noti_type: type,
        noti_sender_id: sender_id,
        noti_receiver_id: receiver_id,
        noti_content: noti_content,
        noti_options: options
      })

      return newNoti
    }

    
}

export default NotificationService