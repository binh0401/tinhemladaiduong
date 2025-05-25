import { BadRequestError } from '../core/error.response.js'
import {OK, CREATED} from '../core/success.response.js'
import { uploadFromImageUrl, uploadFromLocalImage } from '../services/cloudinaryUpload.service.js'

class UploadController{

  uploadFile = async(req,res,next) => {
    new OK({
      message: 'Upload successfully',
      metadata: await uploadFromImageUrl()
    }).send(res)
  }

  uploadFileFromLocal = async(req,res,next) => {
    const {file} = req

    if(!file) throw new BadRequestError('File missing')

    new OK({
      message: 'Upload successfully',
      metadata: await uploadFromLocalImage({
        path: file.path
      })
    }).send(res)
  }

}

export default new UploadController()