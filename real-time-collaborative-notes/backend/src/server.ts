import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { connectDB } from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import corsOptions from './config/corsOptions.js'
import errorHandler from './middleware/errorHandler.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger)

app.all('/api/auth/*', toNodeHandler(auth))

connectDB()

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})
