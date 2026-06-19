import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from 'y-protocols/awareness'
import socket from '../lib/socket'

type AwarenessUpdate = { added: number[]; updated: number[]; removed: number[] }

const COLORS = ['#f87171', '#a78bfa', '#34d399']

const getColor = (id: string) =>
  COLORS[
    Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length
  ]

export const useSocket = (
  docId: string,
  ydoc: Y.Doc,
  user: { id: string; name: string; image?: string },
  enabled: boolean,
  awareness: Awareness,
) => {
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    console.log('useSocket effect ran', { enabled, userId: user.id, docId })

    if (!enabled) return
    console.log('socket connected?', socket.connected, 'user:', user.id)

    setSynced(false)

    const emitJoinAndAwareness = () => {
      console.log('emitting join and awareness')

      socket.emit('join-document', docId, user.id)

      awareness.setLocalState({
        ...(awareness.getLocalState() ?? {}),
        user: { name: user.name, color: getColor(user.id), image: user.image },
      })

      const update = encodeAwarenessUpdate(awareness, [awareness.clientID])
      socket.emit('awareness', docId, update)
    }

    const handleSync = (data: ArrayBuffer) => {
      const update = new Uint8Array(data)
      Y.applyUpdate(ydoc, update, 'remote')
      setSynced(true)
    }

    const handleUpdate = (data: ArrayBuffer) => {
      const update = new Uint8Array(data)
      Y.applyUpdate(ydoc, update, 'remote')
    }

    const handleAwareness = (data: ArrayBuffer) => {
      const update = new Uint8Array(data)
      applyAwarenessUpdate(awareness, update, 'remote')
    }

    const handleJoinError = (msg: string) => {
      console.error('Join error:', msg)
    }

    const handleYjsUpdate = (update: Uint8Array, origin: any) => {
      if (origin === 'remote') return
      socket.emit('update', docId, update)
    }

    const handleAwarenessUpdate = (
      { added, updated, removed }: AwarenessUpdate,
      origin: any,
    ) => {
      if (origin === 'local') {
        const changedClients = added.concat(updated, removed)
        const update = encodeAwarenessUpdate(awareness, changedClients)
        socket.emit('awareness', docId, update)
      } else if (origin === 'remote' && added.length > 0) {
        const update = encodeAwarenessUpdate(awareness, [awareness.clientID])
        socket.emit('awareness', docId, update)
      }
    }

    socket.on('connect', emitJoinAndAwareness)
    socket.on('sync', handleSync)
    socket.on('update', handleUpdate)
    socket.on('awareness', handleAwareness)
    socket.on('join-error', handleJoinError)
    ydoc.on('update', handleYjsUpdate)
    awareness.on('update', handleAwarenessUpdate)

    if (socket.connected) emitJoinAndAwareness()
    else socket.connect()

    const ping = setInterval(() => {
      if (!socket.connected) return
      const update = encodeAwarenessUpdate(awareness, [awareness.clientID])
      socket.emit('awareness', docId, update)
    }, 15000)

    return () => {
      clearInterval(ping)
      awareness.setLocalState(null)
      socket.off('connect', emitJoinAndAwareness)
      socket.off('sync', handleSync)
      socket.off('update', handleUpdate)
      socket.off('awareness', handleAwareness)
      socket.off('join-error', handleJoinError)
      ydoc.off('update', handleYjsUpdate)
      awareness.off('update', handleAwarenessUpdate)
    }
  }, [enabled, docId, ydoc, user.id, awareness])

  return { synced, awareness }
}
