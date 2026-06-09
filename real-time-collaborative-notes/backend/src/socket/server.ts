import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import * as Y from 'yjs'

const docs = new Map<string, Y.Doc>()

const getDoc = (docId: string): Y.Doc => {
  if (!docs.has(docId)) {
    docs.set(docId, new Y.Doc())
  }
  return docs.get(docId)!
}

export const setupWebsocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    let currentDocId: string | null = null

    socket.on('join-document', (docId: string) => {
      currentDocId = docId
      socket.join(docId)

      const doc = getDoc(docId)
      const state = Y.encodeStateAsUpdate(doc)
      socket.emit('sync', Buffer.from(state).toString('base64'))

      console.log(`Socket ${socket.id} joined document ${docId}`)
    })

    socket.on('update', (docId: string, update: string) => {
      const doc = getDoc(docId)
      const binary = Buffer.from(update, 'base64')
      Y.applyUpdate(doc, binary)
      socket.to(docId).emit('update', update)
    })

    socket.on('awareness', (docId: string, awarenessUpdate: string) => {
      socket.to(docId).emit('awareness', awarenessUpdate)
    })

    socket.on('disconnect', () => {
      if (currentDocId) {
        console.log(`Socket ${socket.id} left document ${currentDocId}`)
      }
    })
  })

  console.log('Socket.io server ready')
}
