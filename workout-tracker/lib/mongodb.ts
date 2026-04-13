import mongoose from 'mongoose'
import type { MongooseCache } from '@/types/types'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('MONGODB_URI is not  defined')

declare global {
  var mongoose: MongooseCache
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null }
global.mongoose = cached

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
      family: 4,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    })
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB connected successfully (IPv4)')
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}