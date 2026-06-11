import { useEffect } from 'react'
import * as Y from 'yjs'
import socket from '../lib/socket'

export const useSocket = (docId: string, ydoc: Y.Doc) => {
  useEffect(() => {
    socket.connect()
    socket.once('connect', () => {
      socket.emit('join-document', docId)
    })

    socket.on('sync', (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
    })

    socket.on('update', (base64: string) => {
      const update = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      Y.applyUpdate(ydoc, update, 'remote')
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
      socket.off('sync')
      socket.off('update')
      ydoc.off('update', handleUpdate)
      socket.disconnect()
    }
  }, [docId, ydoc])
}
