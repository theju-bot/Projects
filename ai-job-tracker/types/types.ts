import { Document, Types } from 'mongoose'

export type AIProvider = 
        'anthropic' 
        | 'gemini' 
        | 'groq'
        | 'grok' 

export interface IUser extends Document{
    name: string
    email: string
    image?: string
    aiProvider?: AIProvider
    apiKey?: string
}

export type JobStatus =
  'wishlist'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'

export interface IJob extends Document{
  userId: Types.ObjectId
  company: string
  role: string
  status: JobStatus
  location?: string
  jobUrl?: string
  description?: string
  resumeUsed?: string
  salaryMin?: number
  salaryMax?: number
  fitScore?: number
  appliedAt?: Date
}