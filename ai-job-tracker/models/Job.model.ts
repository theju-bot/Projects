import mongoose, { Schema, Document } from 'mongoose'

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId
  columnId: mongoose.Types.ObjectId
  title: string
  company: string
  location: string
  jobUrl: string
  salary: string
  description: string
  notes: string
  order: number
  appliedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    jobUrl: { type: String, default: '' },
    salary: { type: String, default: '' },
    description: { type: String, default: '' },
    notes: { type: String, default: '' },
    order: { type: Number, required: true, default: 0 },
    appliedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

JobSchema.index({ userId: 1, columnId: 1 })

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)
