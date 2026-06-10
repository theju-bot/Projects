export interface RTCADocument {
  _id: string
  title: string
  content: string
  ownerId: string
  collaborators: string[]
  createdAt: string
  updatedAt: string
}

export interface RTCAUser {
  id: string
  name: string
  email: string
  image?: string
}

export interface RTCACollaborator {
  userId: string
  name: string
  color: string
  cursor?: {
    anchor: number
    head: number
  }
}
