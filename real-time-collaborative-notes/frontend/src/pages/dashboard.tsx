import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authClient from '../lib/authClient'
import {
  useDocuments,
  useCreateDocument,
  useDeleteDocument,
} from '../hooks/useDocuments'
import type { RTCADocument } from '../types/types'
import { LuPencilLine } from 'react-icons/lu'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'

type Tab = 'all' | 'owned' | 'shared'
const tabs: Tab[] = ['all', 'owned', 'shared']

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('all')
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const { data: docs, isLoading } = useDocuments()
  const {
    mutate: createDocument,
    isPending: isCreating,
    isError,
    error,
  } = useCreateDocument()
  const { mutate: deleteDocument } = useDeleteDocument()
  const [showError, setShowError] = useState(false)

  const userId = session?.user.id

  const filtered = docs?.filter((doc) => {
    if (tab === 'owned') return doc.ownerId === userId
    if (tab === 'shared') return doc.ownerId !== userId
    return true
  })

  const handleCreate = () => {
    createDocument(undefined, {
      onSuccess: (doc) => navigate(`/doc/${doc._id}`),
    })
  }

  const handleOpen = (id: string) => navigate(`/doc/${id}`)

  useEffect(() => {
    if (isError) {
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  return (
    <div className='min-h-screen bg-bg'>
      <header className='border-b border-border px-6 py-4'>
        <div className='max-w-5xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-accent rounded-lg flex items-center justify-center'>
              <LuPencilLine size={17.6} />
            </div>
            <span className='font-medium'>NoteFlow</span>
          </div>

          <div className='flex items-center gap-3'>
            {session?.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className='w-8 h-8 rounded-full object-cover'
              />
            )}
            <button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: { onSuccess: () => navigate('/') },
                })
              }
              className='text-sm text-muted hover:text-text transition-colors cursor-pointer'
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-5xl mx-auto px-6 py-10'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-2xl font-medium'>Documents</h1>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className='flex items-center gap-2 px-4 py-2 bg-accent text-bg text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors cursor-pointer disabled:opacity-50'
          >
            <FaPlus size={16} />
            New Document
          </button>
        </div>

        {showError && (
          <p className='text-red-400 text-sm mb-4 text-right'>
            {(error as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ?? 'Failed to create document.'}
          </p>
        )}

        <div className='flex gap-1 mb-6 border-b border-border'>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === t
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className='text-muted text-sm'>Loading...</p>
        ) : filtered?.length === 0 ? (
          <p className='text-muted text-sm'>No documents found.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filtered?.map((doc: RTCADocument) => (
              <div
                key={doc._id}
                onClick={() => handleOpen(doc._id)}
                className='bg-surface border border-border rounded-xl p-5 cursor-pointer hover:border-border-hover hover:bg-surface-hover transition-all group'
              >
                <div className='flex items-start justify-between gap-2'>
                  <h2 className='text-text font-medium text-sm truncate flex-1'>
                    {doc.title || 'Untitled'}
                  </h2>
                  {doc.ownerId === userId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteDocument(doc._id)
                      }}
                      className='opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all cursor-pointer'
                    >
                      <RiDeleteBin6Line size={15} />
                    </button>
                  )}
                </div>
                <div className='flex items-center justify-between mt-3'>
                  <p className='text-xs text-muted'>
                    {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {doc.ownerId !== userId && (
                    <span className='text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full'>
                      Shared
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
