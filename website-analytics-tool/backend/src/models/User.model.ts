import mongoose, { Document, Schema } from 'mongoose'

export interface WATUser extends Document {
  email: string
  password: string
}

const UserSchema = new Schema<WATUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<WATUser>('User', UserSchema)
