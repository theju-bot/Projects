import { Document } from '../models/Document.model.js'
import { debounce } from 'lodash-es'
import { Types } from 'mongoose'
import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import * as Y from 'yjs'
import { auth } from '../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'

const docs = new Map<string, Y.Doc>()
const saves = new Map<string, ReturnType<typeof debounce>>()
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const MAX_UPDATE_SIZE = 1_048_576
const RATE_LIMIT = { max: 1300, window: 10_000 }

const checkRateLimit = (id: string): boolean => {
  const now = Date.now()
  let entry = rateLimitMap.get(id)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT.window }
    rateLimitMap.set(id, entry)
  }
  entry.count++
  // console.log(`rate check for ${id}: count=${entry.count}/${RATE_LIMIT.max}`)
  return entry.count <= RATE_LIMIT.max
}

const getDoc = async (docId: string): Promise<Y.Doc> => {
  if (docs.has(docId)) return docs.get(docId)!

  const saved = await Document.findById(docId)
  if (!saved) throw new Error('Document not found')

  const ydoc = new Y.Doc()
  if (saved.content) {
    try {
      Y.applyUpdate(ydoc, saved.content)
    } catch {
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

const checkAccess = async (docId: string, userId: string): Promise<boolean> => {
  const doc = await Document.findById(docId)
  if (!doc) return false
  return doc.ownerId === userId || doc.collaborators.includes(userId)
}

export const setupWebsocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    path: process.env.SOCKET_PATH || '/socket.io',
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  })

  io.use(async (socket, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(
        socket.handshake.headers as Record<
          string,
          string | string[] | undefined
        >,
      ),
    })

    if (!session) return next(new Error('Unauthorized'))

    socket.data.user = session.user
    next()
  })

  io.on('connection', (socket) => {
    let currentDocId: string | null = null

    socket.on('join-document', async (docId: string) => {
      if (!Types.ObjectId.isValid(docId)) {
        socket.emit('join-error', 'Invalid document ID')
        return
      }

      const hasAccess = await checkAccess(docId, socket.data.user.id)
      if (!hasAccess) {
        socket.emit('join-error', 'Forbidden')
        return
      }

      currentDocId = docId
      socket.join(docId)

      try {
        const state = Y.encodeStateAsUpdate(await getDoc(docId))
        socket.emit('sync', Buffer.from(state))
        console.log(`Socket ${socket.id} joined document ${docId}`)
      } catch (e) {
        console.error(`join-document failed for ${docId}:`, e)
        socket.emit('join-error', 'Failed to join document')
      }
    })

    socket.on('update', async (docId: string, update: Buffer) => {
      if (!socket.rooms.has(docId)) return
      if (!checkRateLimit(socket.id)) {
        socket.disconnect(true)
        return
      }
      if (!update || update.byteLength > MAX_UPDATE_SIZE) {
        socket.disconnect(true)
        return
      }

      try {
        Y.applyUpdate(await getDoc(docId), update)
        socket.to(docId).emit('update', update)
      } catch (e) {
        console.error(`update failed for ${docId}:`, e)
        socket.emit('join-error', 'Document no longer available')
        socket.leave(docId)
      }
    })

    socket.on('awareness', (docId: string, data: Buffer) => {
      if (!socket.rooms.has(docId)) return
      if (!checkRateLimit(socket.id)) {
        socket.disconnect(true)
        return
      }
      if (!data || data.byteLength > MAX_UPDATE_SIZE) {
        socket.disconnect(true)
        return
      }

      socket.to(docId).emit('awareness', data)
    })

    socket.on('disconnect', () => {
      rateLimitMap.delete(socket.id)
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
}
