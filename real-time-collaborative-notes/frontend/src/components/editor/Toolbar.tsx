import type { Editor } from '@tiptap/react'
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md'
import { FaQuoteLeft } from 'react-icons/fa'
import { BiCodeBlock } from 'react-icons/bi'

interface ToolbarProps {
  editor: Editor | null
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md text-sm transition-colors cursor-pointer ${
      isActive
        ? 'bg-accent/20 text-accent'
        : 'text-muted hover:text-text hover:bg-surface-hover'
    }`}
  >
    {children}
  </button>
)

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  return (
    <div className='border-b border-border px-6 py-2 flex items-center gap-1 flex-wrap'>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      >
        <code>{`<>`}</code>
      </ToolbarButton>
      <div className='w-px h-4 bg-border mx-1' />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        H3
      </ToolbarButton>
      <div className='w-px h-4 bg-border mx-1' />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <MdFormatListBulleted size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <MdFormatListNumbered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <FaQuoteLeft size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
      >
        <BiCodeBlock size={18} />
      </ToolbarButton>{' '}
    </div>
  )
}
