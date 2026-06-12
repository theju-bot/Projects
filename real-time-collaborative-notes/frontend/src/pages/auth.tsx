import { useEffect } from 'react'
import authClient from '../lib/authClient'
import { LuPencilLine } from 'react-icons/lu'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Auth() {
  const { data: session } = authClient.useSession()

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/dashboard'

  useEffect(() => {
    if (session) navigate(from, { replace: true })
  }, [session, navigate, from])

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${import.meta.env.VITE_URL}${from}`,
    })
  }

  const handleGithub = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: `${import.meta.env.VITE_URL}${from}`,
    })
  }

  const btnSty =
    'w-full flex items-center justify-center gap-2.5 px-4 py-2.75 rounded-[10px] border border-border bg-surface text-text text-sm font-medium hover:bg-surface-hover hover:border-border-hover transition-colors cursor-pointer'

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center p-8'>
      <div className='border border-border bg-bg p-6 rounded-2xl max-w-110'>
        <div className='flex items-center gap-2.5 mb-10'>
          <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
            <LuPencilLine size={22} />
          </div>
          <span className='text-xl font-medium tracking-tight'>NoteFlow</span>
        </div>

        <h1 className='text-4xl font-medium leading-tight tracking-tight mb-3'>
          Write together,
          <br />
          <span className='text-accent'>in real time.</span>
        </h1>
        <p className='text-[15px] text-muted leading-relaxed mb-10'>
          Noteflow lets your team create, share, and edit notes simultaneously —
          no refresh needed, no conflicts, no lag.
        </p>

        <div className='flex items-center gap-3 mb-6'>
          <div className='flex-1 h-px bg-border' />
          <span className='text-xs text-muted uppercase tracking-wider'>
            sign in / sign up
          </span>
          <div className='flex-1 h-px bg-border' />
        </div>

        <div className='flex flex-col gap-2'>
          <button onClick={handleGoogle} className={`${btnSty}`}>
            <FcGoogle size={18} />
            Continue with Google
          </button>

          <button onClick={handleGithub} className={btnSty}>
            <FaGithub size={18} />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
