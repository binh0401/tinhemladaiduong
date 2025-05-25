import multer from "multer";

//Store in app's memory as Buffer
export const uploadMemory = multer({
  storage: multer.memoryStorage()
})


//Store in server's computer's memory
export const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './src/uploads')
    },

    filename: function(req,file, cb){
      cb(null, `${file.fieldname}-${Date.now()}`)
    }
  }),
})

