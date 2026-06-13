import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import socket from '../lib/socket'

export const useSocket = (
  docId: string,
  ydoc: Y.Doc,
  user: { id: string; name: string; image?: string },
) => {
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    setSynced(false)

    const emitJoinAndAwareness = () => {
      socket.emit('join-document', docId, user.id)

      const colors = [
        '#f87171',
        '#fb923c',
        '#a78bfa',
        '#34d399',
        '#60a5fa',
        '#f472b6',
      ]
      const color = colors[user.id.charCodeAt(0) % colors.length]

      socket.emit(
        'awareness',
        docId,
        JSON.stringify({
          userId: user.id,
          name: user.name,
          color,
          image: user.image,
        }),
      )
    }

    socket.connect()
    socket.on('connect', emitJoinAndAwareness)

    if (socket.connected) {
      emitJoinAndAwareness()
    }

    socket.on('sync', (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
      setSynced(true)
    })

    socket.on('update', (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
    })

    socket.on('join-error', (msg: string) => {
      console.error('Join error:', msg)
    })

    const handleUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === 'remote') return
      let binary = ''
      update.forEach((b) => (binary += String.fromCharCode(b)))
      const base64 = btoa(binary)

      socket.emit('update', docId, base64)
    }

    ydoc.on('update', handleUpdate)

    return () => {
      socket.off('connect', emitJoinAndAwareness)
      socket.off('sync')
      socket.off('update')
      socket.off('join-error')
      ydoc.off('update', handleUpdate)
      socket.disconnect()
    }
  }, [docId, ydoc])

  return { synced }
}
