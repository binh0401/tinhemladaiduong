import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'

export const app = express()


// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

//init db

//init router


//handling error

