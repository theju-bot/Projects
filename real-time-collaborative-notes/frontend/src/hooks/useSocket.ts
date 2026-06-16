import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from 'y-protocols/awareness'
import socket from '../lib/socket'

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

      awareness.setLocalStateField('user', {
        name: user.name,
        color: getColor(user.id),
        image: user.image,
      })

      const update = encodeAwarenessUpdate(awareness, [awareness.clientID])
      const base64 = btoa(String.fromCharCode(...update))
      socket.emit('awareness', docId, base64)
    }

    const handleSync = (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
      setSynced(true)
    }

    const handleUpdate = (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
    }

    const handleAwareness = (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      console.log('update bytes', update)
      console.log('awareness clientID', awareness.clientID)
      applyAwarenessUpdate(awareness, update, 'remote')
      console.log('states after', awareness.getStates())
    }

    const handleJoinError = (msg: string) => {
      console.error('Join error:', msg)
    }

    const handleYjsUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === 'remote') return
      let binary = ''
      update.forEach((b) => (binary += String.fromCharCode(b)))
      socket.emit('update', docId, btoa(binary))
    }

    const handleAwarenessUpdate = ({ added, updated, removed }: any, origin: any) => {
      if (origin === 'local') {
        const changedClients = added.concat(updated, removed)
        const update = encodeAwarenessUpdate(awareness, changedClients)
        const base64 = btoa(String.fromCharCode(...update))
        socket.emit('awareness', docId, base64)
      } else if (origin === 'remote' && added.length > 0) {
        // A new remote client joined. Broadcast our local state so they know we exist!
        const update = encodeAwarenessUpdate(awareness, [awareness.clientID])
        const base64 = btoa(String.fromCharCode(...update))
        socket.emit('awareness', docId, base64)
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
    console.log('local state after set', awareness.getStates())

    return () => {
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
