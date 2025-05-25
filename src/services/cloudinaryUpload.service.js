import cloudinary from '../configs/cloudinary.config.js'

//1, Upload from image url

export const uploadFromImageUrl = async () => {
  try {
    const folderName = 'product/shop01'
    const fileName = 'test'
    const imageUrl = 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-1/486385867_1532643258123036_1419978065244997106_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeErKAVBZGet_rJFtSs8wPOjbSR1gbTovzRtJHWBtOi_NKjV36WVRPve1jfq_Oqv8f53jcczjgxFnAJ_E_S6ubcB&_nc_ohc=di5QE4UgQooQ7kNvwHc2oct&_nc_oc=Adlv7FQyGyCZqcyp9xpf6L43Za1Pjicb6Klx8Bx8mC2cX0RbcNCvHzRnS5zEbcZE8Chio6X5M-tDiM7wB2zmQMPH&_nc_zt=24&_nc_ht=scontent.fhan20-1.fna&_nc_gid=BkvNyLlm57-8qOB2PE3TZA&oh=00_AfKgmlw9TDL87voI9hscQqGjYSCSDJzkGAe739ZVnaSgwg&oe=68351C31'

    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: fileName,
      folder: folderName
    })

    console.log(result)
    return result
  } catch (error) {
    console.log(error)
  }
}


export const uploadFromLocalImage = async({path, folderName='product'}) => {
   try {
    
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })

    console.log(result)
    return {
      image_url: result.secure_url,
      id: 8409
    }
  } catch (error) {
    console.log(error)
  }
}

