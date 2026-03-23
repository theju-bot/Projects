import { Schema, model, models } from 'mongoose'
import { IJob } from '@/types/types'

const JobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'wishlist',
        'applied',
        'screening',
        'interview',
        'offer',
        'rejected',
      ],
      default: 'wishlist',
    },
    location: { type: String },
    jobUrl: { type: String },
    description: { type: String },
    resumeUsed: { type: String },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    fitScore: { type: Number },
    appliedAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

export const JobModel = models.job || model<IJob>('Job', JobSchema)
