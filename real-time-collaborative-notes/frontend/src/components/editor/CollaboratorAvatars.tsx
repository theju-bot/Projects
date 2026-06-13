import { useEffect, useState } from 'react'
import socket from '../../lib/socket'

interface Collaborator {
  userId: string
  name: string
  color: string
  image?: string
}

export default function CollaboratorAvatars() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    const handler = (data: string) => {
      try {
        const parsed = JSON.parse(data) as Collaborator[]
        setCollaborators(parsed)
      } catch {}
    }

    socket.on('awareness', handler)

    return () => {
      socket.off('awareness', handler) 
    }
  }, [])

  if (collaborators.length === 0) return null

  return (
    <div className='flex items-center -space-x-2'>
      {collaborators.map((c) => (
        <div
          key={c.userId}
          title={c.name}
          className='w-7 h-7 rounded-full border-2 border-bg flex items-center justify-center text-xs font-medium text-white overflow-hidden'
          style={{ backgroundColor: c.color }}
        >
          {c.image ? (
            <img
              src={c.image}
              alt={c.name}
              className='w-full h-full object-cover'
            />
          ) : (
            c.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
    </div>
  )
}
