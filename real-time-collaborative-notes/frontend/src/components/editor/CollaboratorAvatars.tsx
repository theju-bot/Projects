import { useEffect, useState } from 'react'
import { Awareness } from 'y-protocols/awareness'

interface CollaboratorState {
  name: string
  color: string
  image?: string
}

export default function CollaboratorAvatars({
  awareness,
}: {
  awareness: Awareness
}) {
  const [collaborators, setCollaborators] = useState<CollaboratorState[]>([])

  useEffect(() => {
    const handler = () => {
      const states: CollaboratorState[] = []
      awareness.getStates().forEach((state, clientID) => {
        if (clientID === awareness.clientID) return
        if (state.user) states.push(state.user as CollaboratorState)
      })
      setCollaborators(states)
    }

    awareness.on('change', handler)
    handler()

    return () => {
      awareness.off('change', handler)
    }
  }, [awareness])

  if (collaborators.length === 0) return null

  return (
    <div className='flex items-center -space-x-2'>
      {collaborators.map((c, i) => (
        <div
          key={i}
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
