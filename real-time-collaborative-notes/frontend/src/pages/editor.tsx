import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { useDocument, useUpdateDocument } from '../hooks/useDocuments'
import { useSocket } from '../hooks/useSocket'
import authClient from '../lib/authClient'
import Toolbar from '../components/editor/Toolbar'
import CollaboratorAvatars from '../components/editor/CollaboratorAvatars'
import ShareModal from '../components/editor/ShareModal'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const { data: doc, isLoading } = useDocument(id!)
  const { mutate: updateDocument } = useUpdateDocument()

  const [title, setTitle] = useState('')
  const [showShare, setShowShare] = useState(false)
  const titleDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ydoc = useMemo(() => new Y.Doc(), [id])

  useSocket(id!, ydoc)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: ydoc }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[calc(100vh-120px)] px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      if (!id) return
      updateDocument({ id, data: { content: editor.getHTML() } })
    },
  })

  useEffect(() => {
    if (doc) setTitle(doc.title)
  }, [doc])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (titleDebounce.current) clearTimeout(titleDebounce.current)
    titleDebounce.current = setTimeout(() => {
      if (id) updateDocument({ id, data: { title: e.target.value } })
    }, 600)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-bg flex items-center justify-center'>
        <p className='text-app-muted text-sm'>Loading document...</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className='min-h-screen bg-bg flex items-center justify-center'>
        <p className='text-app-muted text-sm'>Document not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-bg flex flex-col'>
      {/* Top bar */}
      <header className='border-b border-app-border px-6 py-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 flex-1'>
          <button
            onClick={() => navigate('/dashboard')}
            className='text-app-muted hover:text-app-text transition-colors cursor-pointer'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M19 12H5M12 5l-7 7 7 7' />
            </svg>
          </button>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder='Untitled'
            className='bg-transparent text-app-text font-medium text-sm focus:outline-none w-full max-w-sm placeholder:text-app-muted'
          />
        </div>

        <div className='flex items-center gap-3'>
          <CollaboratorAvatars />
          <button
            onClick={() => setShowShare(true)}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-app-accent text-bg rounded-lg hover:bg-app-accent-dim transition-colors cursor-pointer'
          >
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' />
            </svg>
            Share
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Editor */}
      <div className='flex-1 max-w-4xl w-full mx-auto'>
        <EditorContent editor={editor} />
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal docId={id!} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}
