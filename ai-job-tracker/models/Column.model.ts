import mongoose, { Schema, Document } from 'mongoose'

export interface IColumn extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  order: number
  color: string
  createdAt: Date
  updatedAt: Date
}

const ColumnSchema = new Schema<IColumn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    color: { type: String, default: '#6366f1' },
  },
  { timestamps: true },
)

ColumnSchema.index({ userId: 1 })

export const Column =
  mongoose.models.Column || mongoose.model<IColumn>('Column', ColumnSchema)
