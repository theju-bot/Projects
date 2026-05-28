import mongoose, { Document, Schema } from 'mongoose'

export interface WATSite extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  domain: string
}

const SiteSchema = new Schema<WATSite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<WATSite>('Site', SiteSchema)
