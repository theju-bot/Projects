import { Document } from '../models/Document.model.js'
import { debounce } from 'lodash-es'
import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import * as Y from 'yjs'

const docs = new Map<string, Y.Doc>()
const saves = new Map<string, ReturnType<typeof debounce>>()

const getDoc = async (docId: string): Promise<Y.Doc> => {
  if (docs.has(docId)) return docs.get(docId)!

  const ydoc = new Y.Doc()
  const saved = await Document.findById(docId)
  if (saved?.content) {
    try {
      Y.applyUpdate(ydoc, saved.content)
    } catch (e) {
      console.warn(`Corrupt Yjs state for ${docId}, resetting.`)
      await Document.findByIdAndUpdate(docId, { content: null })
    }
  }
  docs.set(docId, ydoc)

  const save = debounce(async () => {
    const state = Y.encodeStateAsUpdate(ydoc)
    await Document.findByIdAndUpdate(docId, { content: Buffer.from(state) })
  }, 2000)

  ydoc.on('update', save)
  saves.set(docId, save)

  return ydoc
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

    socket.on('join-document', async (docId: string) => {
      currentDocId = docId
      socket.join(docId)

      const state = Y.encodeStateAsUpdate(await getDoc(docId))
      socket.emit('sync', Buffer.from(state).toString('base64'))

      console.log(`Socket ${socket.id} joined document ${docId}`)
    })

    socket.on('update', async (docId: string, update: string) => {
      const binary = Buffer.from(update, 'base64')
      Y.applyUpdate(await getDoc(docId), binary)
      socket.to(docId).emit('update', update)
    })

    socket.on('awareness', (docId: string, base64: string) => {
      socket.to(docId).emit('awareness', base64)
    })

    socket.on('disconnect', () => {
      if (!currentDocId) return
      console.log(`Socket ${socket.id} left document ${currentDocId}`)
      const socketRoom = io.sockets.adapter.rooms.get(currentDocId)
      if (!socketRoom || socketRoom.size === 0) {
        saves.get(currentDocId)?.flush()
        saves.delete(currentDocId)
        docs.delete(currentDocId)
        console.log(`Cleaned up doc ${currentDocId} from memory`)
      }
    })
  })

  console.log('Socket.io server ready')
}
