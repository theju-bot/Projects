import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className='flex w-full justify-between border-s-4 p-4'>
      <h1>Workout Tracker</h1>
      <Navbar />
    </header>
  )
}
