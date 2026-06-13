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
import { LuArrowLeft } from 'react-icons/lu'
import { RiShareBoxLine } from 'react-icons/ri'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const { data: doc, isLoading } = useDocument(id!)
  const { mutate: updateDocument } = useUpdateDocument()

  const [title, setTitle] = useState('')
  const [showShare, setShowShare] = useState(false)
  const titleDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hydrated = useRef(false)

  const ydoc = useMemo(() => new Y.Doc(), [id])

  const { synced } = useSocket(id!, ydoc, {
    id: session?.user.id ?? '',
    name: session?.user.name ?? 'Anonymous',
    image: session?.user.image ?? undefined,
  })

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
      if (!id || !hydrated.current) return
      if (contentDebounce.current) clearTimeout(contentDebounce.current)
      contentDebounce.current = setTimeout(() => {
        updateDocument({ id, data: { content: editor.getHTML() } })
      }, 2000)
    },
  })

  useEffect(() => {
    if (doc) setTitle(doc.title)
    if (!editor || !doc?.content || !synced || hydrated.current) return

    if (editor.isEmpty) {
      editor.commands.setContent(doc.content)
    }
    hydrated.current = true
  }, [editor, doc, synced])

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
        <p className='text-muted text-sm'>Loading document...</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className='min-h-screen bg-bg flex items-center justify-center'>
        <p className='text-muted text-sm'>Document not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-bg flex flex-col'>
      <header className='border-b border-border px-6 py-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 flex-1'>
          <button
            onClick={() => navigate('/dashboard')}
            className='text-muted hover:text-text transition-colors cursor-pointer'
          >
            <LuArrowLeft size={15} />
          </button>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder='Untitled'
            className='bg-transparent text-text font-medium text-sm focus:outline-none w-full max-w-sm placeholder:text-muted'
          />
        </div>

        <div className='flex items-center gap-3'>
          <CollaboratorAvatars />
          <button
            onClick={() => setShowShare(true)}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent text-bg rounded-lg hover:bg-accent-dim transition-colors cursor-pointer'
          >
            <RiShareBoxLine size={16} />
            Share
          </button>
        </div>
      </header>

      <Toolbar editor={editor} />

      <div className='flex-1 max-w-4xl w-full mx-auto'>
        <EditorContent editor={editor} />
      </div>

      {showShare && (
        <ShareModal docId={id!} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}
