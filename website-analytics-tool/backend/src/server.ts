import express from 'express'
const app = express()
import mongoose from 'mongoose'
import connectDB from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'

import 'dotenv/config'
const PORT = process.env.PORT || 5000

app.use(logger)

app.use(express.json())

app.use(cookieParser())

connectDB()

// routes

// error handler
app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
