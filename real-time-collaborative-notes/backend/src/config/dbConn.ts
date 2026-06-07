import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
  } catch (err) {
    console.error('MongoDB connection error: ', err)
    process.exit(1)
  }
}

export default connectDB
