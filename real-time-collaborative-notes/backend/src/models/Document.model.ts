import mongoose, { type Document as MongoDocument, Schema } from 'mongoose'

export interface RTCNDocument extends MongoDocument {
  title: string
  content: string
  ownerId: string
  collaborators: string[]
}

const DocumentSchema = new Schema<RTCNDocument>({
  title: {
    type: String,
    default: 'Untitled',
  },
  content: {
    type: String,
    default: '',
  },
  ownerId: {
    type: String,
    required: true,
  },
  collaborators: [{ type: String }],
})

export const Document = mongoose.model<RTCNDocument>('Document', DocumentSchema)
