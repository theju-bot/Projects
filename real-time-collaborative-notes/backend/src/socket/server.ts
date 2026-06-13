import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import * as Y from 'yjs'

const docs = new Map<string, Y.Doc>()
const presence = new Map<string, Map<string, string>>()

const getDoc = (docId: string): Y.Doc => {
  if (!docs.has(docId)) {
    docs.set(docId, new Y.Doc())
  }
  return docs.get(docId)!
}

const getPresence = (docId: string): Map<string, string> => {
  if (!presence.has(docId)) presence.set(docId, new Map())
  return presence.get(docId)!
}

const broadcastPresence = (io: Server, docId: string) => {
  const room = getPresence(docId)
  const all = Array.from(room.values()).map((v) => JSON.parse(v) as unknown)
  io.to(docId).emit('awareness', JSON.stringify(all))
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
      getPresence(docId)

      const state = Y.encodeStateAsUpdate(getDoc(docId))
      socket.emit('sync', Buffer.from(state).toString('base64'))

      console.log(`Socket ${socket.id} joined document ${docId}`)
    })

    socket.on('update', (docId: string, update: string) => {
      const binary = Buffer.from(update, 'base64')
      Y.applyUpdate(getDoc(docId), binary)
      socket.to(docId).emit('update', update)
    })

    socket.on('awareness', (docId: string, awarenessUpdate: string) => {
      getPresence(docId).set(socket.id, awarenessUpdate)
      broadcastPresence(io, docId)
    })

    socket.on('disconnect', () => {
      if (!currentDocId) return

      console.log(`Socket ${socket.id} left document ${currentDocId}`)

      const socketRoom = io.sockets.adapter.rooms.get(currentDocId)
      if (!socketRoom || socketRoom.size === 0) {
        docs.delete(currentDocId)
        presence.delete(currentDocId)
        console.log(`Cleaned up doc ${currentDocId} from memory`)
      } else {
        const presenceRoom = getPresence(currentDocId)
        presenceRoom.delete(socket.id)
        broadcastPresence(io, currentDocId)
      }
    })
  })

  console.log('Socket.io server ready')
}
