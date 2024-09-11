import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes'
import { Blobs } from './models/blobs'

require('dotenv').config()

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

const allowedOrigin = process.env.CORS_ORIGIN ?? 'https://react.jenniina.fi'

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Content-Type'],
  })
)
app.use(express.json())
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))
app.use(routes)

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.zzpvtsc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((error) => {
    throw error
  })
