import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import siteRoute from './routes/sites.route.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(logger)
app.use(express.json())
app.use(cookieParser())

connectDB()

app.use('/api/auth', authRoute)
app.use('/api/site', siteRoute)

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})
