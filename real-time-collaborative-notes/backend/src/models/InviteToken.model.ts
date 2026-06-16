import mongoose, { type Document, Schema, Types } from 'mongoose'

export interface RTCNInviteToken extends Document {
  token: String
  documentId: Types.ObjectId
  expiresAt: Date
  used: boolean
}

const InviteTokenSchema = new Schema<RTCNInviteToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  documentId: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
})

export const InviteToken = mongoose.model<RTCNInviteToken>(
  'InviteToken',
  InviteTokenSchema,
)
