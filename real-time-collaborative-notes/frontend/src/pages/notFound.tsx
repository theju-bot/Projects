import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-bg flex items-center justify-center font-mono pb-50'>
      <div className='text-center'>
        <h1 className='text-8xl font-medium text-accent mb-4'>404</h1>
        <p className='text-text text-xl mb-2'>Page not found</p>
        <p className='text-muted text-sm mb-8'>
          The page you're looking for doesn't exist
        </p>
        <button onClick={() => navigate('/', { replace: true })} className='px-6 py-2.5 rounded-lg bg-accent text-bg text-sm font-sans font-medium hover:bg-accent-dim transition-colors cursor-pointer'>
          Go home
        </button>
      </div>
    </div>
  )
}
