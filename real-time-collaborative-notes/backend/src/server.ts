import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { createServer } from 'node:http'
import { connectDB } from './config/dbConn.js'
import { logger } from './middleware/logEvents.js'
import corsOptions from './config/corsOptions.js'
import errorHandler from './middleware/errorHandler.js'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'
import documentRoutes from './routes/documents.route.js'
import inviteRoutes from './routes/invites.route.js'
import { setupWebsocketServer } from './socket/server.js'

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger)

app.all('/api/auth/*path', toNodeHandler(auth))

connectDB()

app.use('/api/documents', documentRoutes)
app.use('/api/invites', inviteRoutes)

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  setupWebsocketServer(httpServer)
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err)
})
