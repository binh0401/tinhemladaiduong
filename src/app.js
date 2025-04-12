import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet'
import compression from 'compression';
import { checkOverload } from './helpers/check.connect.js'
import router from './routes/index.js';
import dotenv from 'dotenv'
dotenv.config()

const app = express()


// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression()) //reduce data size travelling
app.use(express.json())
app.use(express.urlencoded({ //handle if user does not send data in JSON, but in url
  extended: true            //handle nested objects 
}))

//init db
import instanceMongodb from './dbs/init.mongodb.js'
//checkOverload()


//init routes
app.use('/', router)


//handling error middleware: 404 ERROR, must stay after routes
app.use((req,res,next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req,res,next) => {
  const statusCode = error.status || 500
  console.log(error)
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})


export default app