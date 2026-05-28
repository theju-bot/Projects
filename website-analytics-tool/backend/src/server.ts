import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import connectDB from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import corsOptions from './config/corsOptions.js'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import siteRoute from './routes/sites.route.js'
import eventRoute from './routes/events.route.js'
import analyticsRoute from './routes/analytics.route.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions))

app.use(logger)
app.use(express.json())
app.use(cookieParser())

connectDB()

app.use('/api/auth', authRoute)
app.use('/api/sites', siteRoute)
app.use('/api/events', eventRoute)
app.use('/api/analytics', analyticsRoute)

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})
