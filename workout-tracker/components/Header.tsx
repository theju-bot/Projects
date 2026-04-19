import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className='flex w-full justify-between  p-4 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold tracking-tight'>Workout Tracker</h1>
      <Navbar />
    </header>
  )
}
