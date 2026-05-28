import mongoose, { Document, Schema } from 'mongoose'

export interface WATEvent extends Document {
  siteId: mongoose.Types.ObjectId
  type: string
  path: string
  referrer: string
  browser: string
  os: string
  country: string
}

const EventSchema = new Schema<WATEvent>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      default: '',
    },
    browser: {
      type: String,
      default: '',
    },
    os: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

export default mongoose.model<WATEvent>('Event', EventSchema)
